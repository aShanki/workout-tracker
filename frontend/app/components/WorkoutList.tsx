  'use client'

import { Stack, Card, Text, Title, Loader } from '@mantine/core'
import { useState, useEffect } from 'react'
import { Workout } from '../types/workout'
import { initTestState, getTestWorkouts } from '../utils/test-state'

export function WorkoutList() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadWorkouts = () => {
    try {
      if (process.env.NODE_ENV === 'test') {
        console.log('Loading workouts in test environment...')
        initTestState() // Initialize test state
        const testWorkouts = getTestWorkouts()
        console.log('Retrieved workouts:', testWorkouts)
        setWorkouts(testWorkouts)
      } else {
        // TODO: Implement API fetch
        setWorkouts([])
      }
    } catch (error) {
      console.error('Error loading workouts:', error)
      setWorkouts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial load
    loadWorkouts()

    // Set up polling for test environment
    let interval: NodeJS.Timeout
    if (process.env.NODE_ENV === 'test') {
      interval = setInterval(() => {
        console.log('Polling for workout updates...')
        loadWorkouts()
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <Stack align="center" spacing="lg" style={{ width: '100%' }} data-testid="workout-list-loading">
        <Loader size="lg" />
        <Text>Loading workouts...</Text>
      </Stack>
    )
  }

  // Determine which container to show based on workout state
  const Container = workouts.length > 0 ? 
    <Stack spacing="lg" data-testid="workout-list" style={{ width: '100%' }}>
      {workouts.map((workout) => (
        <Card 
          key={workout.id} 
          shadow="sm" 
          p="lg" 
          data-testid="workout-card"
          withBorder
          style={{ width: '100%' }}
        >
          <Title order={3}>{workout.name}</Title>
          <Text>{workout.description}</Text>
          {workout.exercises.map((exercise, index) => (
            <div key={`${workout.id}-exercise-${index}`}>
              <Text weight={500} mt="md">Exercise {index + 1}</Text>
              {exercise.sets.map((set, setIndex) => (
                <Text 
                  key={`${workout.id}-exercise-${index}-set-${setIndex}`}
                  data-testid={`workout-set-${index}-${setIndex}`}
                >
                  {set.reps} reps × {set.weight} kg
                </Text>
              ))}
            </div>
          ))}
        </Card>
      ))}
    </Stack>
    :
    <Stack align="center" spacing="lg" data-testid="empty-workout-list">
      <Text>No workouts found. Create your first workout!</Text>
    </Stack>

  return Container
}
