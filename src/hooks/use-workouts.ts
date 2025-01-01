import { useState, useCallback } from 'react';
import type { Workout } from '@/types/workout';

interface UseWorkoutsState {
  workouts: Workout[];
  isLoading: boolean;
  error: Error | null;
}

interface CreateWorkoutInput {
  name: string;
  description?: string;
  exercises: {
    id: string;
    sets: number;
    reps: number;
    weight?: number;
    notes?: string;
  }[];
  scheduledFor?: string;
}

export function useWorkouts() {
  const [state, setState] = useState<UseWorkoutsState>({
    workouts: [],
    isLoading: false,
    error: null,
  });

  const fetchWorkouts = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch('/api/workouts');
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      const data = await response.json();
      setState(prev => ({ ...prev, workouts: data, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Unknown error'),
        isLoading: false,
      }));
    }
  }, []);

  const createWorkout = useCallback(async (workout: CreateWorkoutInput) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create workout');
      }
      
      const newWorkout = await response.json();
      setState(prev => ({
        ...prev,
        workouts: [...prev.workouts, newWorkout],
        isLoading: false,
      }));
      
      return newWorkout;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Unknown error'),
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  const updateWorkout = useCallback(async (id: string, updates: Partial<CreateWorkoutInput>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update workout');
      }
      
      const updatedWorkout = await response.json();
      setState(prev => ({
        ...prev,
        workouts: prev.workouts.map(w => w.id === id ? updatedWorkout : w),
        isLoading: false,
      }));
      
      return updatedWorkout;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Unknown error'),
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  const deleteWorkout = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete workout');
      }
      
      setState(prev => ({
        ...prev,
        workouts: prev.workouts.filter(w => w.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Unknown error'),
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    fetchWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
  };
}