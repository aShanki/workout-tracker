import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkoutDashboard } from '@/components/workouts/workout-dashboard';
import * as hooks from '@/hooks/use-workouts';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

describe('WorkoutDashboard', () => {
  const mockWorkouts = [
    {
      id: '1',
      name: 'Morning Workout',
      description: 'Full body routine',
      exercises: [
        { id: '1', name: 'Squats', sets: 3, reps: 10 }
      ],
      scheduledFor: '2024-01-10T08:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      userId: 'user-1'
    }
  ];

  const mockHookReturn = {
    workouts: mockWorkouts,
    isLoading: false,
    error: null,
    fetchWorkouts: jest.fn(),
    createWorkout: jest.fn(),
    updateWorkout: jest.fn(),
    deleteWorkout: jest.fn(),
  };

  beforeEach(() => {
    jest.spyOn(hooks, 'useWorkouts').mockImplementation(() => mockHookReturn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders workout list', () => {
    render(<WorkoutDashboard />);
    expect(screen.getByText('Morning Workout')).toBeInTheDocument();
    expect(screen.getByText('Full body routine')).toBeInTheDocument();
  });

  it('opens create workout dialog when add button is clicked', async () => {
    render(<WorkoutDashboard />);
    const addButton = screen.getByRole('button', { name: /new workout/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create New Workout')).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    jest.spyOn(hooks, 'useWorkouts').mockImplementation(() => ({
      ...mockHookReturn,
      isLoading: true,
      workouts: []
    }));

    render(<WorkoutDashboard />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error state', () => {
    const errorMessage = 'Failed to fetch workouts';
    jest.spyOn(hooks, 'useWorkouts').mockImplementation(() => ({
      ...mockHookReturn,
      error: new Error(errorMessage),
      workouts: []
    }));

    render(<WorkoutDashboard />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('allows workout deletion', async () => {
    const mockDeleteWorkout = jest.fn();
    jest.spyOn(hooks, 'useWorkouts').mockImplementation(() => ({
      ...mockHookReturn,
      deleteWorkout: mockDeleteWorkout
    }));

    render(<WorkoutDashboard />);
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    expect(mockDeleteWorkout).toHaveBeenCalledWith('1');
  });
});