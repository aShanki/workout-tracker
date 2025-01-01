export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
  completed?: boolean;
  userId: string;
  comments?: string[];
}

export interface WorkoutSchedule {
  id: string;
  workoutId: string;
  userId: string;
  scheduledFor: string;
  completed: boolean;
  notes?: string;
}