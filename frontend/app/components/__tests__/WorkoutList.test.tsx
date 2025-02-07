import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/test-utils';
import { WorkoutList } from '../WorkoutList';
import { WorkoutResponse, WorkoutStatus } from '../../types/workout';

const mockWorkouts: WorkoutResponse[] = [
  {
    id: '1',
    name: 'Monday Upper Body',
    description: 'Chest and triceps workout',
    status: 'scheduled' as WorkoutStatus,
    scheduledAt: '2025-02-07T10:00:00Z',
    exercises: [
      {
        exerciseId: '1',
        sets: [{ reps: 10, weight: 100 }],
        notes: 'Warm up first'
      }
    ],
    exerciseDetails: [
      {
        id: '1',
        name: 'Bench Press',
        description: 'Chest exercise'
      }
    ],
    createdAt: '2025-02-06T10:00:00Z',
    updatedAt: '2025-02-06T10:00:00Z'
  },
  {
    id: '2',
    name: 'Tuesday Lower Body',
    description: 'Legs workout',
    status: 'completed' as WorkoutStatus,
    exercises: [
      {
        exerciseId: '2',
        sets: [{ reps: 8, weight: 150 }],
        notes: ''
      }
    ],
    exerciseDetails: [
      {
        id: '2',
        name: 'Squat',
        description: 'Leg exercise'
      }
    ],
    createdAt: '2025-02-06T11:00:00Z',
    updatedAt: '2025-02-06T11:00:00Z'
  }
];

describe('WorkoutList', () => {
  const mockStatusChange = jest.fn();
  const mockDelete = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockStatusChange.mockClear();
    mockDelete.mockClear();
  });

  it('renders workouts correctly', () => {
    render(
      <WorkoutList
        workouts={mockWorkouts}
        onStatusChange={mockStatusChange}
        onDelete={mockDelete}
      />
    );

    // Check workout names
    expect(screen.getByText('Monday Upper Body')).toBeInTheDocument();
    expect(screen.getByText('Tuesday Lower Body')).toBeInTheDocument();

    // Check descriptions
    expect(screen.getByText('Chest and triceps workout')).toBeInTheDocument();
    expect(screen.getByText('Legs workout')).toBeInTheDocument();

    // Check exercise details
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Squat')).toBeInTheDocument();
    expect(screen.getByText('(Warm up first)')).toBeInTheDocument();

    // Check set counts
    expect(screen.getAllByText('1 set')).toHaveLength(2);
  });

  it('displays correct status badges', () => {
    render(
      <WorkoutList
        workouts={mockWorkouts}
        onStatusChange={mockStatusChange}
        onDelete={mockDelete}
      />
    );

    const scheduledBadge = screen.getByText('Scheduled');
    const completedBadge = screen.getByText('Completed');

    expect(scheduledBadge).toBeInTheDocument();
    expect(completedBadge).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(
      <WorkoutList
        workouts={mockWorkouts}
        onStatusChange={mockStatusChange}
        onDelete={mockDelete}
      />
    );

    const scheduledDate = screen.getByTestId('scheduled-date-1');
    expect(scheduledDate).toHaveTextContent(
      'Scheduled for: ' + new Date('2025-02-07T10:00:00Z').toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    );

    // Check unscheduled workout date
    const unscheduledDate = screen.getByTestId('scheduled-date-2');
    expect(unscheduledDate).toHaveTextContent('Scheduled for: Not scheduled');
  });

  it('handles status changes correctly', async () => {
    render(
      <WorkoutList
        workouts={mockWorkouts}
        onStatusChange={mockStatusChange}
        onDelete={mockDelete}
      />
    );

    // Open menu for first workout
    await user.click(screen.getByTestId('menu-button-1'));

    // Wait for the menu to appear and click "Mark as Completed"
    await waitFor(() => {
      expect(screen.getByText('Mark as Completed')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Mark as Completed'));

    expect(mockStatusChange).toHaveBeenCalledWith('1', 'completed');
  });

  it('handles workout deletion', async () => {
    render(
      <WorkoutList
        workouts={mockWorkouts}
        onStatusChange={mockStatusChange}
        onDelete={mockDelete}
      />
    );

    // Open menu for first workout
    await user.click(screen.getByTestId('menu-button-1'));

    // Wait for the menu to appear and click "Delete"
    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Delete'));

    expect(mockDelete).toHaveBeenCalledWith('1');
  });

  it('shows no description message when description is empty', () => {
    const workoutsWithNoDesc = [
      {
        ...mockWorkouts[0],
        description: ''
      }
    ];

    render(
      <WorkoutList
        workouts={workoutsWithNoDesc}
        onStatusChange={mockStatusChange}
        onDelete={mockDelete}
      />
    );

    expect(screen.getByText('No description provided')).toBeInTheDocument();
  });

  it('handles exercises with missing details gracefully', () => {
    const workoutsWithMissingExercise = [
      {
        ...mockWorkouts[0],
        exercises: [
          {
            exerciseId: 'non-existent',
            sets: [{ reps: 10, weight: 100 }],
            notes: ''
          }
        ]
      }
    ];

    render(
      <WorkoutList
        workouts={workoutsWithMissingExercise}
        onStatusChange={mockStatusChange}
        onDelete={mockDelete}
      />
    );

    // Verify the exercise group is not rendered
    expect(screen.queryByTestId('exercise-group')).not.toBeInTheDocument();
  });
});