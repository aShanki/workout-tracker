'use client'

import { useAuth } from './providers/auth-context'
import { Container, Title, Text, Button, TextInput, PasswordInput, Stack, Group, Paper, Tabs } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState, useEffect } from 'react'
import { IconDumbbell, IconHistory } from '@tabler/icons-react'
import { WorkoutForm } from './components/WorkoutForm'
import { WorkoutList } from './components/WorkoutList'
import * as api from './services/api'
import { Exercise } from './types/exercise'
import { WorkoutResponse, WorkoutStatus } from './types/workout'

interface AuthForm {
  email: string
  password: string
}

export default function Home() {
  const { user, login, signup } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [workouts, setWorkouts] = useState<WorkoutResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadExercises()
      loadWorkouts()
    }
  }, [user])

  const loadExercises = async () => {
    try {
      const data = await api.exercises.list()
      setExercises(data)
    } catch (error) {
      console.error('Failed to load exercises:', error)
    }
  }

  const loadWorkouts = async () => {
    try {
      const data = await api.workouts.list()
      setWorkouts(data)
    } catch (error) {
      console.error('Failed to load workouts:', error)
    }
  }

  const handleCreateWorkout = async (data: any) => {
    try {
      setIsLoading(true)
      await api.workouts.create(data)
      await loadWorkouts()
    } catch (error) {
      console.error('Failed to create workout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (workoutId: string, status: WorkoutStatus) => {
    try {
      await api.workouts.updateStatus(workoutId, status)
      await loadWorkouts()
    } catch (error) {
      console.error('Failed to update workout status:', error)
    }
  }

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      await api.workouts.delete(workoutId)
      await loadWorkouts()
    } catch (error) {
      console.error('Failed to delete workout:', error)
    }
  }

  const handleSubmit = async (values: AuthForm) => {
    try {
      setError('')
      if (isLogin) {
        await login(values.email, values.password)
      } else {
        await signup(values.email, values.password)
      }
    } catch (err) {
      setError('Authentication failed. Please try again.')
    }
  }

  const form = useForm<AuthForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
    },
  })

  if (user) {
    return (
      <Container size="lg" py="xl">
        <Title order={1} mb="lg">Your Workout Dashboard</Title>
        
        <Tabs defaultValue="workouts">
          <Tabs.List>
            <Tabs.Tab value="workouts" leftSection={<IconDumbbell size={16} />}>
              Workouts
            </Tabs.Tab>
            <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
              History
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="workouts" pt="xl">
            <Stack spacing="xl">
              <Paper withBorder p="md">
                <Title order={3} mb="md">Create New Workout</Title>
                <WorkoutForm
                  exercises={exercises}
                  onSubmit={handleCreateWorkout}
                  isLoading={isLoading}
                />
              </Paper>

              <Paper withBorder p="md">
                <Title order={3} mb="md">Your Workouts</Title>
                <WorkoutList
                  workouts={workouts.filter(w => w.status === 'planned')}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteWorkout}
                />
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="history" pt="xl">
            <Paper withBorder p="md">
              <Title order={3} mb="md">Workout History</Title>
              <WorkoutList
                workouts={workouts.filter(w => w.status !== 'planned')}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteWorkout}
              />
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Container>
    )
  }

  return (
    <Container size="xs" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} ta="center" mb="lg">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="hello@example.com"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              {...form.getInputProps('password')}
            />

            {error && (
              <Text c="red" size="sm">
                {error}
              </Text>
            )}

            <Button type="submit" fullWidth mt="xl">
              {isLogin ? 'Sign in' : 'Create account'}
            </Button>

            <Group justify="center" mt="md">
              <Text size="sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </Text>
              <Button
                variant="subtle"
                size="sm"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Create account' : 'Sign in'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}
