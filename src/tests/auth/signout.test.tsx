import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { POST } from '@/app/api/auth/signout/route'

// Mock the entire modules
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn()
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn()
}))

describe('Sign Out API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully sign out the user', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: null })
    const mockSupabase = {
      auth: {
        signOut: mockSignOut
      }
    }

    ;(createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase)
    ;(cookies as unknown as jest.Mock).mockReturnValue({
      getAll: () => []
    })

    const response = await POST()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ message: 'Successfully signed out' })
    expect(mockSignOut).toHaveBeenCalled()
  })

  it('should handle sign out errors', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ 
      error: { message: 'Sign out failed' } 
    })
    const mockSupabase = {
      auth: {
        signOut: mockSignOut
      }
    }

    ;(createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase)
    ;(cookies as unknown as jest.Mock).mockReturnValue({
      getAll: () => []
    })

    const response = await POST()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Sign out failed' })
  })

  it('should handle GET requests', async () => {
    const { GET } = require('@/app/api/auth/signout/route')
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(405)
    expect(data).toEqual({ error: 'Method not allowed' })
  })
})
