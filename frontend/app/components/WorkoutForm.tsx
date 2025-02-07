'use client'

import { useState } from 'react'
import { Box, Button, TextInput, Textarea, Select, NumberInput, Group, Stack, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Set, WorkoutExercise } from '../types/workout'
import { Exercise } from '../types/exercise'

interface WorkoutFormProps {
  exercises: Exercise[]
  onSubmit: (data: any) => void
  isLoading?: boolean
}

interface WorkoutFormValues {
  name: string
  description: string
  exercises: WorkoutExercise[]
  scheduledAt?: Date
}

export function WorkoutForm({ exercises, onSubmit, isLoading }: WorkoutFormProps) {
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([])

  const form = useForm<WorkoutFormValues>({
    initialValues: {
      name: '',
      description: '',
      exercises: [],
      scheduledAt: undefined,
    },
    validate: {
      name: (value) => (value.length < 1 ? 'Name is required' : null),
    },
  })

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
    form.setFieldValue('exercises', updated)
  }

  const handleUpdateSet = (exerciseIndex: number, setIndex: number, field: keyof Set, value: number) => {
    const updated = [...selectedExercises]
    updated[exerciseIndex].sets[setIndex] = {
      ...updated[exerciseIndex].sets[setIndex],
      [field]: value,
    }
    setSelectedExercises(updated)
    form.setFieldValue('exercises', updated)
  }

  const handleAddSet = (exerciseIndex: number) => {
    const updated = [...selectedExercises]
    updated[exerciseIndex].sets.push({ reps: 0, weight: 0 })
    setSelectedExercises(updated)
    form.setFieldValue('exercises', updated)
  }

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="md">
        <TextInput
          required
          label="Workout Name"
          placeholder="e.g., Monday Upper Body"
          {...form.getInputProps('name')}
        />

        <Textarea
          label="Description"
          placeholder="Workout description"
          {...form.getInputProps('description')}
        />

        <Box>
          <Title order={3} mb="md">Exercises</Title>
          {selectedExercises.map((exercise, exerciseIndex) => (
            <Box key={exerciseIndex} mb="lg" p="md" style={{ border: '1px solid #eee', borderRadius: '4px' }}>
              <Stack spacing="sm">
                <Select
                  required
                  label="Exercise"
                  placeholder="Select exercise"
                  data={exercises.map(ex => ({ value: ex.id, label: ex.name }))}
                  value={exercise.exerciseId}
                  onChange={(value) => handleUpdateExercise(exerciseIndex, 'exerciseId', value)}
                />

                <Textarea
                  label="Notes"
                  placeholder="Exercise notes"
                  value={exercise.notes}
                  onChange={(e) => handleUpdateExercise(exerciseIndex, 'notes', e.target.value)}
                />

                {exercise.sets.map((set, setIndex) => (
                  <Group key={setIndex} grow>
                    <NumberInput
                      required
                      label="Reps"
                      min={0}
                      value={set.reps}
                      onChange={(value) => handleUpdateSet(exerciseIndex, setIndex, 'reps', Number(value))}
                    />
                    <NumberInput
                      required
                      label="Weight (kg)"
                      min={0}
                      value={set.weight}
                      onChange={(value) => handleUpdateSet(exerciseIndex, setIndex, 'weight', Number(value))}
                    />
                  </Group>
                ))}

                <Button
                  variant="outline"
                  onClick={() => handleAddSet(exerciseIndex)}
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
          >
            Add Exercise
          </Button>
        </Box>

        <Button type="submit" loading={isLoading}>
          Create Workout
        </Button>
      </Stack>
    </form>
  )
}
