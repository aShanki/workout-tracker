import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, exercises, scheduledFor } = body;

    // Create the workout
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: session.user.id,
        name,
        description,
        scheduled_for: scheduledFor
      })
      .select()
      .single();

    if (workoutError) throw workoutError;

    // Add exercises if provided
    if (exercises?.length > 0) {
      const workoutExercises = exercises.map(exercise => ({
        workout_id: workout.id,
        exercise_id: exercise.id,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        notes: exercise.notes
      }));

      const { error: exerciseError } = await supabase
        .from('workout_exercises')
        .insert(workoutExercises);

      if (exerciseError) throw exerciseError;
    }

    return NextResponse.json(workout, { status: 201 });
  } catch (error: any) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.status || 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: workouts, error } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises (
          *,
          exercise:exercises (*)
        )
      `)
      .eq('user_id', session.user.id)
      .order('scheduled_for', { ascending: true });

    if (error) throw error;

    return NextResponse.json(workouts, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, exercises, scheduledFor } = body;

    // Update workout
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .update({
        name,
        description,
        scheduled_for: scheduledFor,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (workoutError) throw workoutError;

    // Update exercises if provided
    if (exercises) {
      // Delete existing exercises
      await supabase
        .from('workout_exercises')
        .delete()
        .eq('workout_id', params.id);

      // Insert new exercises
      if (exercises.length > 0) {
        const workoutExercises = exercises.map(exercise => ({
          workout_id: params.id,
          exercise_id: exercise.id,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          notes: exercise.notes
        }));

        const { error: exerciseError } = await supabase
          .from('workout_exercises')
          .insert(workoutExercises);

        if (exerciseError) throw exerciseError;
      }
    }

    return NextResponse.json(workout, { status: 200 });
  } catch (error: any) {
    console.error('Error updating workout:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', params.id)
      .eq('user_id', session.user.id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.status || 500 }
    );
  }
}