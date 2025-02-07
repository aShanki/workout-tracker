package models

import (
"time"

"go.mongodb.org/mongo-driver/bson/primitive"
)

type WorkoutStatus string

const (
StatusPlanned   WorkoutStatus = "planned"
StatusCompleted WorkoutStatus = "completed"
StatusCancelled WorkoutStatus = "cancelled"
)

type WorkoutExercise struct {
ExerciseID primitive.ObjectID `bson:"exercise_id" json:"exercise_id"`
Sets       []Set             `bson:"sets" json:"sets"`
Notes      string            `bson:"notes,omitempty" json:"notes,omitempty"`
}

type Set struct {
Reps     int     `bson:"reps" json:"reps"`
Weight   float64 `bson:"weight" json:"weight"`
Duration int     `bson:"duration,omitempty" json:"duration,omitempty"` // Duration in seconds for cardio exercises
}

type Workout struct {
ID          primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
UserID      primitive.ObjectID  `bson:"user_id" json:"user_id"`
Name        string             `bson:"name" json:"name"`
Description string             `bson:"description,omitempty" json:"description,omitempty"`
Exercises   []WorkoutExercise  `bson:"exercises" json:"exercises"`
Status      WorkoutStatus      `bson:"status" json:"status"`
ScheduledAt *time.Time         `bson:"scheduled_at,omitempty" json:"scheduled_at,omitempty"`
CompletedAt *time.Time         `bson:"completed_at,omitempty" json:"completed_at,omitempty"`
CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
UpdatedAt   time.Time          `bson:"updated_at" json:"updated_at"`
}

type CreateWorkoutRequest struct {
Name        string            `json:"name" binding:"required"`
Description string           `json:"description"`
Exercises   []WorkoutExercise `json:"exercises" binding:"required,min=1"`
ScheduledAt *time.Time        `json:"scheduled_at"`
}

type UpdateWorkoutRequest struct {
Name        string            `json:"name"`
Description string           `json:"description"`
Exercises   []WorkoutExercise `json:"exercises"`
Status      WorkoutStatus     `json:"status"`
ScheduledAt *time.Time        `json:"scheduled_at"`
}

type WorkoutResponse struct {
Workout
ExerciseDetails []Exercise `json:"exercise_details"`
}
