-- Enable RLS
alter default privileges in schema public grant all on tables to postgres, anon, authenticated;

-- Create tables
create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.exercises (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category text not null,
  muscle_group text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.workouts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  description text,
  scheduled_for timestamp with time zone,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.workout_exercises (
  id uuid default uuid_generate_v4() primary key,
  workout_id uuid references public.workouts(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) on delete cascade not null,
  sets integer not null,
  reps integer not null,
  weight numeric(5,2),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_exercises enable row level security;

-- Create RLS policies
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Exercises are viewable by all users"
  on public.exercises for select
  to authenticated
  using (true);

create policy "Workouts are viewable by owner"
  on public.workouts for select
  using (auth.uid() = user_id);

create policy "Workout exercises are viewable by workout owner"
  on public.workout_exercises for select
  using (
    exists (
      select 1 from public.workouts
      where id = workout_exercises.workout_id
      and user_id = auth.uid()
    )
  );

-- Create functions
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

-- Create triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
