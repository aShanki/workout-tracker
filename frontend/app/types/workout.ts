export interface Set {
  reps: number
  weight: number
  duration?: number // Duration in seconds for cardio exercises
}

export interface WorkoutExercise {
  exerciseId: string
  sets: Set[]
  notes?: string
}

export interface Workout {
  id: string
  userId: string
  name: string
  description?: string
  exercises: WorkoutExercise[]
  status: WorkoutStatus
  scheduledAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export type WorkoutStatus = 'planned' | 'completed' | 'cancelled'

export interface CreateWorkoutRequest {
  name: string
  description?: string
  exercises: WorkoutExercise[]
  scheduledAt?: string
}

export interface UpdateWorkoutRequest {
  name?: string
  description?: string
  exercises?: WorkoutExercise[]
  status?: WorkoutStatus
  scheduledAt?: string
}

export interface WorkoutResponse extends Workout {
  exerciseDetails: Exercise[]
}
