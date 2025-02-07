'use client'

import { Card, Text, Group, Badge, Stack, Button, ActionIcon, Menu } from '@mantine/core'
import { IconDots, IconTrash, IconCheck, IconX } from '@tabler/icons-react'
import { WorkoutResponse, WorkoutStatus } from '../types/workout'

interface WorkoutListProps {
  workouts: WorkoutResponse[]
  onStatusChange: (workoutId: string, status: WorkoutStatus) => void
  onDelete: (workoutId: string) => void
}

export function WorkoutList({ workouts, onStatusChange, onDelete }: WorkoutListProps) {
  const getStatusColor = (status: WorkoutStatus) => {
    switch (status) {
      case 'completed':
        return 'green'
      case 'cancelled':
        return 'red'
      default:
        return 'blue'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Stack spacing="md">
      {workouts.map((workout) => (
        <Card key={workout.id} withBorder padding="md">
          <Card.Section inheritPadding py="xs">
            <Group position="apart">
              <Text fw={500} size="lg">
                {workout.name}
              </Text>
              <Group>
                <Badge color={getStatusColor(workout.status)}>
                  {workout.status.charAt(0).toUpperCase() + workout.status.slice(1)}
                </Badge>
                <Menu position="bottom-end" shadow="md">
                  <Menu.Target>
                    <ActionIcon data-testid={`menu-button-${workout.id}`}>
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    {workout.status !== 'completed' && (
                      <Menu.Item
                        color="green"
                        icon={<IconCheck size={16} />}
                        onClick={() => onStatusChange(workout.id, 'completed')}
                        data-testid={`complete-button-${workout.id}`}
                      >
                        Mark as Completed
                      </Menu.Item>
                    )}
                    {workout.status !== 'cancelled' && (
                      <Menu.Item
                        color="red"
                        icon={<IconX size={16} />}
                        onClick={() => onStatusChange(workout.id, 'cancelled')}
                        data-testid={`cancel-button-${workout.id}`}
                      >
                        Cancel Workout
                      </Menu.Item>
                    )}
                    <Menu.Item
                      color="red"
                      icon={<IconTrash size={16} />}
                      onClick={() => onDelete(workout.id)}
                      data-testid={`delete-button-${workout.id}`}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Card.Section>

          <Text c="dimmed" size="sm" mt="xs">
            {workout.description || 'No description provided'}
          </Text>

          <Text size="sm" mt="md" fw={500} data-testid={`scheduled-date-${workout.id}`}>
            Scheduled for: {formatDate(workout.scheduledAt)}
          </Text>

          <Stack mt="md" spacing="xs">
            {workout.exercises.map((exercise, index) => {
              const exerciseDetails = workout.exerciseDetails.find(
                (e) => e.id === exercise.exerciseId
              )
              if (!exerciseDetails) return null

              return (
                <Group key={index} position="apart" data-testid="exercise-group">
                  <Text size="sm">
                    {exerciseDetails.name}
                    {exercise.notes && (
                      <Text span size="xs" c="dimmed" ml={4}>
                        ({exercise.notes})
                      </Text>
                    )}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'sets'}
                  </Text>
                </Group>
              )
            })}
          </Stack>
        </Card>
      ))}
    </Stack>
  )
}
