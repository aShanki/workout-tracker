import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/test-utils';
import { WorkoutForm } from '../WorkoutForm';
import { Exercise } from '../../types/exercise';

const mockExercises: Exercise[] = [
  { id: '1', name: 'Bench Press', description: 'Chest exercise' },
  { id: '2', name: 'Squat', description: 'Leg exercise' },
];

describe('WorkoutForm', () => {
  const mockSubmit = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders form elements correctly', () => {
    render(<WorkoutForm exercises={mockExercises} onSubmit={mockSubmit} />);
    
    expect(screen.getByTestId('workout-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('workout-description-input')).toBeInTheDocument();
    expect(screen.getByText(/exercises/i)).toBeInTheDocument();
    expect(screen.getByTestId('add-exercise-button')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<WorkoutForm exercises={mockExercises} onSubmit={mockSubmit} />);
    
    // Try to submit without filling required fields
    await user.click(screen.getByTestId('submit-button'));

    // Wait for error to appear in the input's aria-invalid attribute
    await waitFor(() => {
      const nameInput = screen.getByTestId('workout-name-input');
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('handles adding exercises', async () => {
    render(<WorkoutForm exercises={mockExercises} onSubmit={mockSubmit} />);
    
    // Add an exercise
    await user.click(screen.getByTestId('add-exercise-button'));
    
    // Should show exercise selection and set inputs
    expect(screen.getByTestId('exercise-select-0')).toBeInTheDocument();
    expect(screen.getByTestId('reps-input-0-0')).toBeInTheDocument();
    expect(screen.getByTestId('weight-input-0-0')).toBeInTheDocument();
    expect(screen.getByTestId('add-set-button-0')).toBeInTheDocument();
  });

  it('handles adding sets to exercises', async () => {
    render(<WorkoutForm exercises={mockExercises} onSubmit={mockSubmit} />);
    
    // Add an exercise
    await user.click(screen.getByTestId('add-exercise-button'));
    
    // Add a set
    await user.click(screen.getByTestId('add-set-button-0'));
    
    // Should show two sets of reps/weight inputs
    const repsInputs = screen.getAllByTestId(/reps-input-0-/);
    const weightInputs = screen.getAllByTestId(/weight-input-0-/);
    
    expect(repsInputs).toHaveLength(2);
    expect(weightInputs).toHaveLength(2);
  });

  it('submits form data correctly', async () => {
    const { container } = render(<WorkoutForm exercises={mockExercises} onSubmit={mockSubmit} />);
    
    // Fill out form
    await user.type(screen.getByTestId('workout-name-input'), 'Test Workout');
    await user.type(screen.getByTestId('workout-description-input'), 'Test Description');
    
    // Add an exercise
    await user.click(screen.getByTestId('add-exercise-button'));
    
    // Select exercise (Mantine select requires special handling)
    const exerciseSelect = screen.getByTestId('exercise-select-0');
    await user.click(exerciseSelect);
    
    // The select options are rendered in a portal outside the form
    const selectOption = screen.getByText('Bench Press');
    await user.click(selectOption);
    
    // Update reps and weight
    const repsInput = screen.getByTestId('reps-input-0-0');
    const weightInput = screen.getByTestId('weight-input-0-0');
    
    await user.clear(repsInput);
    await user.type(repsInput, '10');
    
    await user.clear(weightInput);
    await user.type(weightInput, '100');
    
    // Submit form
    await user.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'Test Workout',
        description: 'Test Description',
        exercises: [
          {
            exerciseId: '1',
            sets: [{ reps: 10, weight: 100 }],
            notes: ''
          }
        ],
        scheduledAt: undefined
      });
    });
  });

  it('shows loading state', () => {
    render(<WorkoutForm exercises={mockExercises} onSubmit={mockSubmit} isLoading={true} />);
    
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toHaveAttribute('data-loading', 'true');
  });
});