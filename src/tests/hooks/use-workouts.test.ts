import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { useWorkouts } from '@/hooks/use-workouts';

describe('useWorkouts', () => {
  beforeEach(() => {
    // Reset fetch mocks between tests
    global.fetch = jest.fn();
  });

  it('should fetch workouts', async () => {
    const mockWorkouts = [
      {
        id: '1',
        name: 'Test Workout',
        description: 'Test Description',
        exercises: []
      }
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWorkouts
    });

    const { result } = renderHook(() => useWorkouts());

    await act(async () => {
      await result.current.fetchWorkouts();
    });

    expect(result.current.workouts).toEqual(mockWorkouts);
    expect(result.current.isLoading).toBe(false);
  });

  it('should create a new workout', async () => {
    const newWorkout = {
      name: 'New Workout',
      description: 'New Description',
      exercises: []
    };

    const mockResponse = { id: '1', ...newWorkout };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useWorkouts());

    await act(async () => {
      await result.current.createWorkout(newWorkout);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newWorkout)
    });
  });

  it('should handle errors when fetching workouts', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    const { result } = renderHook(() => useWorkouts());

    await act(async () => {
      await result.current.fetchWorkouts();
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.isLoading).toBe(false);
  });
});