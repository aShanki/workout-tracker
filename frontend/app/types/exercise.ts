export type ExerciseCategory = 'cardio' | 'strength' | 'flexibility'

export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core'

export interface Exercise {
  id: string
  name: string
  description: string
  category: ExerciseCategory
  muscleGroup: MuscleGroup
  createdAt: string
  updatedAt: string
}

export interface CreateExerciseRequest {
  name: string
  description: string
  category: ExerciseCategory
  muscleGroup: MuscleGroup
}

export interface UpdateExerciseRequest {
  name?: string
  description?: string
  category?: ExerciseCategory
  muscleGroup?: MuscleGroup
}
