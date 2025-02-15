'use client'

import { useState } from 'react'
import { Box, Button, TextInput, Textarea, Select, NumberInput, Group, Stack, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Set, WorkoutExercise } from '../types/workout'
import { Exercise } from '../types/exercise'
import { useRouter } from 'next/navigation'

interface WorkoutFormProps {
  exercises: Exercise[]
  onSubmit: (data: any) => Promise<void> | void
  isLoading?: boolean
}

interface WorkoutFormValues {
  name: string
  description: string
  exercises: WorkoutExercise[]
  scheduledAt?: Date
}

export function WorkoutForm({ exercises, onSubmit, isLoading }: WorkoutFormProps) {
  const router = useRouter()
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([])

  const form = useForm<WorkoutFormValues>({
    initialValues: {
      name: '',
      description: '',
      exercises: [],
      scheduledAt: undefined,
    },
  })

  const handleSubmit = async (values: WorkoutFormValues) => {
    const formData = {
      ...values,
      exercises: selectedExercises.map(ex => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets.map(set => ({
          reps: Number(set.reps) || 0,
          weight: Number(set.weight) || 0,
        })),
        notes: ex.notes || '',
      })),
    }

    await onSubmit(formData)
    router.push('/')
  }

  const handleAddExercise = () => {
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId: '',
        sets: [{ reps: 0, weight: 0 }],
        notes: '',
      },
    ])
  }

  const handleUpdateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    const updated = [...selectedExercises]
    updated[index] = { ...updated[index], [field]: value }
    setSelectedExercises(updated)
  }

  const handleUpdateSet = (exerciseIndex: number, setIndex: number, field: keyof Set, value: number) => {
    const updated = [...selectedExercises]
    const exercise = updated[exerciseIndex]
    exercise.sets[setIndex] = {
      ...exercise.sets[setIndex],
      [field]: value,
    }
    setSelectedExercises(updated)
  }

  const handleAddSet = (exerciseIndex: number) => {
    const updated = [...selectedExercises]
    updated[exerciseIndex].sets.push({ reps: 0, weight: 0 })
    setSelectedExercises(updated)
  }

  return (
    <form 
      onSubmit={form.onSubmit(handleSubmit)}
      data-testid="workout-form"
    >
      <Stack spacing="md">
        <TextInput
          required
          label="Workout Name"
          placeholder="e.g., Monday Upper Body"
          data-testid="workout-name-input"
          {...form.getInputProps('name')}
        />

        <Textarea
          label="Description"
          placeholder="Workout description"
          data-testid="workout-description-input"
          {...form.getInputProps('description')}
        />

        <Box>
          <Title order={3}>Exercises</Title>
          {selectedExercises.map((exercise, exerciseIndex) => (
            <Box key={exerciseIndex} mb="lg" p="md" style={{ border: '1px solid #eee', borderRadius: '4px' }}>
              <Stack spacing="sm">
                <Select
                  required
                  label="Exercise"
                  placeholder="Select exercise"
                  data={exercises.map(ex => ({ value: ex.id, label: ex.name }))}
                  value={exercise.exerciseId}
                  onChange={(value) => handleUpdateExercise(exerciseIndex, 'exerciseId', value || '')}
                  data-testid={`exercise-select-${exerciseIndex}`}
                />

                <Textarea
                  label="Notes"
                  placeholder="Exercise notes"
                  value={exercise.notes}
                  onChange={(e) => handleUpdateExercise(exerciseIndex, 'notes', e.target.value)}
                  data-testid={`exercise-notes-${exerciseIndex}`}
                />

                {exercise.sets.map((set, setIndex) => (
                  <Group key={setIndex} grow>
                    <NumberInput
                      required
                      label="Reps"
                      min={0}
                      value={set.reps}
                      onChange={(value) => handleUpdateSet(exerciseIndex, setIndex, 'reps', Number(value))}
                      data-testid={`reps-input-${exerciseIndex}-${setIndex}`}
                    />
                    <NumberInput
                      required
                      label="Weight (kg)"
                      min={0}
                      value={set.weight}
                      onChange={(value) => handleUpdateSet(exerciseIndex, setIndex, 'weight', Number(value))}
                      data-testid={`weight-input-${exerciseIndex}-${setIndex}`}
                    />
                  </Group>
                ))}

                <Button
                  variant="outline"
                  onClick={() => handleAddSet(exerciseIndex)}
                  data-testid={`add-set-button-${exerciseIndex}`}
                >
                  Add Set
                </Button>
              </Stack>
            </Box>
          ))}

          <Button
            variant="outline"
            onClick={handleAddExercise}
            mb="lg"
            data-testid="add-exercise-button"
          >
            Add Exercise
          </Button>
        </Box>

        <Button 
          type="submit" 
          loading={isLoading}
          data-testid="submit-button"
        >
          Create Workout
        </Button>
      </Stack>
    </form>
  )
}
