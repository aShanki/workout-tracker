import { Workout } from '../types/workout'

declare global {
  interface Window {
    __testState?: {
      workouts: Workout[];
      initialized: boolean;
    };
  }
}

// Mock data
const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Test E2E Workout',
    description: 'Created during E2E test',
    exercises: [
      {
        exerciseId: '1',
        sets: [
          { reps: 10, weight: 100 },
          { reps: 8, weight: 110 }
        ],
        notes: ''
      }
    ]
  }
]

// Initialize test state
export const initTestState = () => {
  if (process.env.NODE_ENV === 'test' && typeof window !== 'undefined') {
    console.log('Initializing test state...');
    if (!window.__testState?.initialized) {
      window.__testState = {
        workouts: [...mockWorkouts],
        initialized: true
      };
      console.log('Test state initialized with:', window.__testState.workouts);
    } else {
      console.log('Test state already initialized:', window.__testState.workouts);
    }
  }
}

// Add workout to test state
export const addWorkoutToTestData = (workout: Workout) => {
  if (process.env.NODE_ENV === 'test' && typeof window !== 'undefined') {
    initTestState();
    window.__testState!.workouts = [...window.__testState!.workouts, workout];
    console.log('Added workout:', workout);
    console.log('Updated workouts:', window.__testState!.workouts);
    return true;
  }
  return false;
}

// Get workouts from test state
export const getTestWorkouts = () => {
  if (process.env.NODE_ENV === 'test' && typeof window !== 'undefined') {
    initTestState();
    const workouts = window.__testState!.workouts;
    console.log('Retrieving workouts:', workouts);
    return workouts;
  }
  return [];
}

// Reset test state
export const resetTestState = () => {
  if (process.env.NODE_ENV === 'test' && typeof window !== 'undefined') {
    console.log('Resetting test state...');
    window.__testState = {
      workouts: [...mockWorkouts],
      initialized: true
    };
    console.log('Test state reset to:', window.__testState.workouts);
  }
}

// Initialize immediately in test environment
if (process.env.NODE_ENV === 'test' && typeof window !== 'undefined') {
  initTestState();
}