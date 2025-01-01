import { useEffect, useState } from 'react'
import { useWorkouts } from '@/hooks/use-workouts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PlusIcon, TrashIcon, PencilIcon, CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { WorkoutForm } from './workout-form'

export function WorkoutDashboard() {
  const { workouts, isLoading, error, fetchWorkouts, createWorkout, deleteWorkout } = useWorkouts()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock available exercises - replace with actual data fetch
  const availableExercises = [
    { id: '1', name: 'Squats', category: 'Legs', muscle_group: 'Quadriceps' },
    { id: '2', name: 'Bench Press', category: 'Chest', muscle_group: 'Pectorals' },
    { id: '3', name: 'Deadlift', category: 'Back', muscle_group: 'Lower Back' }
  ]

  useEffect(() => {
    fetchWorkouts()
  }, [fetchWorkouts])

  const handleCreateWorkout = async (data: any) => {
    await createWorkout(data)
    setIsDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner role="progressbar" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Workouts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Workout</DialogTitle>
              <DialogDescription>
                Add a new workout to your schedule
              </DialogDescription>
            </DialogHeader>
            <WorkoutForm 
              onSubmit={handleCreateWorkout}
              availableExercises={availableExercises}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader>
              <CardTitle>{workout.name}</CardTitle>
              <CardDescription>{workout.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workout.scheduledFor && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(new Date(workout.scheduledFor), 'PPP')}
                  </div>
                )}
                <div className="text-sm">
                  {workout.exercises?.length || 0} exercises
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Workout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this workout? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteWorkout(workout.id)}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" size="icon">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}