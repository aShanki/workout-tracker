'use client'

import { Button, Stack, Title, TextInput, PasswordInput } from '@mantine/core'
import { useAuthContext } from './providers/auth-context'
import { useRouter } from 'next/navigation'
import { FormEvent, useState, useEffect } from 'react'
import { WorkoutList } from './components/WorkoutList'
import { initTestState } from './utils/test-state'

export default function Home() {
  const { isAuthenticated, login } = useAuthContext()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    // Initialize test state if in test environment
    if (process.env.NODE_ENV === 'test') {
      initTestState()
    }
  }, [])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <Stack align="center" justify="center" h="100vh">
        <Title order={1}>Workout Tracker</Title>
        <Stack spacing="sm">
          <form data-testid="login-form" onSubmit={handleLogin}>
            <Stack spacing="sm">
              <TextInput
                type="email"
                placeholder="Email"
                data-testid="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <PasswordInput
                placeholder="Password"
                data-testid="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit">Login</Button>
            </Stack>
          </form>
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack align="center" spacing="xl" p="xl" style={{ minHeight: '100vh' }}>
      <Title order={1}>Your Workouts</Title>
      
      <Button
        variant="filled"
        onClick={() => router.push('/workout/create')}
        data-testid="create-workout-button"
        mb="md"
      >
        Create New Workout
      </Button>
      
      <WorkoutList />
    </Stack>
  )
}
