// Test state for E2E testing
import { Workout } from '../types/workout'

let workouts: Workout[] = []

export const initTestState = () => {
  workouts = []
}

export const getTestWorkouts = (): Workout[] => {
  return [...workouts]
}

export const addWorkoutToTestData = (workout: Workout): boolean => {
  try {
    workouts.push(workout)
    return true
  } catch (error) {
    console.error('Error adding workout to test data:', error)
    return false
  }
}