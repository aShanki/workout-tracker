import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkoutForm } from '@/components/workouts/workout-form';
import { describe, expect, it, jest } from '@jest/globals';
import userEvent from '@testing-library/user-event';

// Mock RadixUI components
jest.mock('@radix-ui/react-select', () => ({
  Root: ({ children, onValueChange }: any) => (
    <div data-testid="select-root">
      {children}
      <select onChange={(e) => onValueChange(e.target.value)}>
        <option value="1">Squats</option>
        <option value="2">Bench Press</option>
      </select>
    </div>
  ),
  Trigger: ({ children }: any) => <button data-testid="select-trigger">{children}</button>,
  Value: ({ children }: any) => <span>{children}</span>,
  Portal: ({ children }: any) => <div>{children}</div>,
  Content: ({ children }: any) => <div>{children}</div>,
  Viewport: ({ children }: any) => <div>{children}</div>,
  Item: ({ children, value }: any) => (
    <div data-value={value} role="option">
      {children}
    </div>
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
    const select = screen.getByTestId('select-trigger');
    await userEvent.click(select);
    await userEvent.selectOptions(screen.getByRole('combobox'), '1');
    
    // Fill in sets and reps
    await userEvent.type(screen.getByLabelText(/sets/i), '3');
    await userEvent.type(screen.getByLabelText(/reps/i), '10');
    
    expect(screen.getByText('Squats')).toBeInTheDocument();
  });

  it('submits form with workout data', async () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} availableExercises={mockExercises} />);
    
    // Fill form fields
    await userEvent.type(screen.getByLabelText(/workout name/i), 'Test Workout');
    await userEvent.type(screen.getByLabelText(/description/i), 'Test Description');
    
    // Add exercise
    await userEvent.click(screen.getByText(/add exercise/i));
    const select = screen.getByTestId('select-trigger');
    await userEvent.click(select);
    await userEvent.selectOptions(screen.getByRole('combobox'), '1');
    
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
    const select = screen.getByTestId('select-trigger');
    await userEvent.click(select);
    await userEvent.selectOptions(screen.getByRole('combobox'), '1');
    
    // Remove exercise
    await userEvent.click(screen.getByRole('button', { name: /remove/i }));
    
    expect(screen.queryByText('Squats')).not.toBeInTheDocument();
  });
});