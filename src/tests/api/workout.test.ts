import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { POST, GET, PUT, DELETE } from '@/app/api/workouts/route';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// Mock cookies
jest.mock('next/headers', () => ({
  cookies: () => ({
    getAll: () => [],
    get: () => null
  })
}));

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    getSession: jest.fn(() => Promise.resolve({
      data: { session: { user: { id: 'test-user-id' } } },
      error: null
    }))
  },
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({
          data: { id: 'test-id', name: 'Test Workout' },
          error: null
        }))
      }))
    })),
    select: jest.fn(() => Promise.resolve({
      data: [{ id: 'test-id', name: 'Test Workout' }],
      error: null
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: { id: 'test-id', name: 'Updated Workout' },
            error: null
          }))
        }))
      }))
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({
        error: null
      }))
    }))
  }))
};

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(() => mockSupabaseClient)
}));

describe('Workout API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/workouts', () => {
    it('should create a new workout', async () => {
      const req = new Request('http://localhost/api/workouts', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Full Body Workout',
          description: 'Complete full body routine',
          exercises: [
            { name: 'Squats', sets: 3, reps: 10, weight: 135 }
          ]
        })
      });

      const response = await POST(req);
      expect(response.status).toBe(201);
      
      const data = await response.json();
      expect(data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String)
        })
      );

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('workouts');
    });
  });

  describe('GET /api/workouts', () => {
    it('should return list of workouts', async () => {
      const req = new Request('http://localhost/api/workouts');
      const response = await GET(req);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String)
          })
        ])
      );

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('workouts');
    });
  });

  describe('PUT /api/workouts/[id]', () => {
    it('should update an existing workout', async () => {
      const workoutId = 'test-workout-id';
      const req = new Request(`http://localhost/api/workouts/${workoutId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Workout Name'
        })
      });

      const response = await PUT(req, { params: { id: workoutId } });
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: 'Updated Workout'
        })
      );

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('workouts');
    });
  });

  describe('DELETE /api/workouts/[id]', () => {
    it('should delete a workout', async () => {
      const workoutId = 'test-workout-id';
      const req = new Request(`http://localhost/api/workouts/${workoutId}`, {
        method: 'DELETE'
      });

      const response = await DELETE(req, { params: { id: workoutId } });
      expect(response.status).toBe(200);
      
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('workouts');
    });
  });
});