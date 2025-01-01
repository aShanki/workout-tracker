import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkoutForm } from '@/components/workouts/workout-form';
import { describe, expect, it, jest } from '@jest/globals';
import userEvent from '@testing-library/user-event';

// Mock Radix UI Select component
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: any) => (
    <div>
      <select data-testid="exercise-select" onChange={(e) => onValueChange(e.target.value)}>
        <option value="">Select an exercise</option>
        <option value="1">Squats</option>
        <option value="2">Bench Press</option>
      </select>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ value, children }: any) => (
    <option value={value}>{children}</option>
  ),
}));

describe('WorkoutForm', () => {
  const mockOnSubmit = jest.fn();
  const mockExercises = [
    { id: '1', name: 'Squats', category: 'Legs', muscle_group: 'Quadriceps' },
    { id: '2', name: 'Bench Press', category: 'Chest', muscle_group: 'Pectorals' }
  ];

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders workout form fields', () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} availableExercises={mockExercises} />);
    
    expect(screen.getByLabelText(/workout name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/schedule for/i)).toBeInTheDocument();
  });

  it('allows adding exercises to workout', async () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} availableExercises={mockExercises} />);
    
    // Click add exercise button
    await userEvent.click(screen.getByText(/add exercise/i));
    
    // Select exercise using mocked select
    const select = screen.getByTestId('exercise-select');
    await userEvent.selectOptions(select, '1');
    
    // Fill in sets and reps
    const setsInput = screen.getByLabelText(/sets/i);
    const repsInput = screen.getByLabelText(/reps/i);
    
    await userEvent.type(setsInput, '3');
    await userEvent.type(repsInput, '10');
    
    expect(screen.getByText('Squats')).toBeInTheDocument();
  });

  it('submits form with workout data', async () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} availableExercises={mockExercises} />);
    
    // Fill form fields
    await userEvent.type(screen.getByLabelText(/workout name/i), 'Test Workout');
    await userEvent.type(screen.getByLabelText(/description/i), 'Test Description');
    
    // Add exercise
    await userEvent.click(screen.getByText(/add exercise/i));
    const select = screen.getByTestId('exercise-select');
    await userEvent.selectOptions(select, '1');
    
    await userEvent.type(screen.getByLabelText(/sets/i), '3');
    await userEvent.type(screen.getByLabelText(/reps/i), '10');
    
    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /save workout/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Workout',
          description: 'Test Description',
          exercises: expect.arrayContaining([
            expect.objectContaining({
              id: '1',
              sets: 3,
              reps: 10
            })
          ])
        })
      );
    });
  });

  it('validates required fields', async () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} availableExercises={mockExercises} />);
    
    // Try to submit without required fields
    await userEvent.click(screen.getByRole('button', { name: /save workout/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/workout name is required/i)).toBeInTheDocument();
    });
  });

  it('allows removing exercises', async () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} availableExercises={mockExercises} />);
    
    // Add exercise
    await userEvent.click(screen.getByText(/add exercise/i));
    const select = screen.getByTestId('exercise-select');
    await userEvent.selectOptions(select, '1');
    
    // Remove exercise
    await userEvent.click(screen.getByRole('button', { name: /remove/i }));
    
    expect(screen.queryByText('Squats')).not.toBeInTheDocument();
  });
});