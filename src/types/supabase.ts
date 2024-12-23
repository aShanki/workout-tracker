export type User = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
};

export type Exercise = {
  id: string;
  name: string;
  description: string | null;
  category: 'cardio' | 'strength' | 'flexibility';
  muscle_group: string | null;
  created_at: string;
  updated_at: string;
};

export type Workout = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  scheduled_for: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type WorkoutExercise = {
  id: string;
  workout_id: string;
  exercise_id: string;
  sets: number;
  reps: number;
  weight: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  exercise?: Exercise;
};
