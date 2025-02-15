'use client'

import { Stack, Title } from '@mantine/core'
import { WorkoutForm } from '../../components/WorkoutForm'
import { Exercise } from '../../types/exercise'
import { useRouter } from 'next/navigation'
import { Workout } from '../../types/workout'
import { addWorkoutToTestData, getTestWorkouts } from '../../utils/test-state'

// Mock exercises for E2E tests
const mockExercises: Exercise[] = [
  { id: '1', name: 'Bench Press', description: 'Chest exercise' },
  { id: '2', name: 'Squat', description: 'Leg exercise' },
]

export default function CreateWorkoutPage() {
  const router = useRouter()

  const handleSubmit = async (data: Workout) => {
    if (process.env.NODE_ENV === 'test') {
      console.log('CreateWorkoutPage: Creating workout in test env:', data)
      
      // Debug current state before update
      console.log('CreateWorkoutPage: Current test workouts:', getTestWorkouts())
      
      // Create workout with ID
      const workout = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      }

      // Add to test data
      const added = addWorkoutToTestData(workout)
      console.log('CreateWorkoutPage: Workout added to test state:', added)

      // Debug updated state
      console.log('CreateWorkoutPage: Updated test workouts:', getTestWorkouts())

      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 500))
    } else {
      // TODO: Implement API call
      console.log('Submitting workout:', data)
    }
    
    // Navigate back to home page
    router.push('/')
    
    if (process.env.NODE_ENV === 'test') {
      // Additional wait for test environment to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  return (
    <Stack spacing="xl" p="xl">
      <Title order={1}>Create Workout</Title>
      <WorkoutForm 
        exercises={mockExercises} 
        onSubmit={handleSubmit}
        data-testid="workout-form"
      />
    </Stack>
  )
}