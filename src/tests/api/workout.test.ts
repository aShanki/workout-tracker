import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { POST, GET, PUT, DELETE } from '@/app/api/workouts/route';
import { createMocks } from 'node-mocks-http';

// Mock Supabase
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: () => ({
    auth: {
      getSession: () => Promise.resolve({
        data: { session: { user: { id: 'test-user-id' } } }
      })
    },
    from: (table: string) => ({
      insert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: 'test-id', ...data } })
        })
      }),
      select: () => Promise.resolve({
        data: [{ id: 'test-id', name: 'Test Workout' }]
      }),
      update: (data: any) => ({
        eq: () => Promise.resolve({ data: { id: 'test-id', ...data } })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null })
      })
    })
  })
}));

jest.mock('next/headers', () => ({
  cookies: () => ({ getAll: () => [] }),
  headers: () => new Headers()
}));

describe('Workout API', () => {
  describe('POST /api/workouts', () => {
    it('should create a new workout', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          name: 'Full Body Workout',
          description: 'Complete full body routine',
          exercises: [
            { name: 'Squats', sets: 3, reps: 10, weight: 135 }
          ]
        }
      });

      const response = await POST(new Request('http://localhost/api/workouts', {
        method: 'POST',
        body: JSON.stringify(req.body)
      }));

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: 'Full Body Workout'
        })
      );
    });
  });

  describe('GET /api/workouts', () => {
    it('should return list of workouts', async () => {
      const response = await GET(new Request('http://localhost/api/workouts'));
      
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
    });
  });

  describe('PUT /api/workouts/[id]', () => {
    it('should update an existing workout', async () => {
      const workoutId = 'test-workout-id';
      const response = await PUT(
        new Request(`http://localhost/api/workouts/${workoutId}`, {
          method: 'PUT',
          body: JSON.stringify({ name: 'Updated Workout Name' })
        }),
        { params: { id: workoutId } }
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        expect.objectContaining({
          id: workoutId,
          name: 'Updated Workout Name'
        })
      );
    });
  });

  describe('DELETE /api/workouts/[id]', () => {
    it('should delete a workout', async () => {
      const workoutId = 'test-workout-id';
      const response = await DELETE(
        new Request(`http://localhost/api/workouts/${workoutId}`),
        { params: { id: workoutId } }
      );

      expect(response.status).toBe(200);
    });
  });
});