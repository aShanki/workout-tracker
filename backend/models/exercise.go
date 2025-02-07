package models

import (
"time"

"go.mongodb.org/mongo-driver/bson/primitive"
)

type ExerciseCategory string

const (
CategoryCardio      ExerciseCategory = "cardio"
CategoryStrength    ExerciseCategory = "strength"
CategoryFlexibility ExerciseCategory = "flexibility"
)

type MuscleGroup string

const (
MuscleChest    MuscleGroup = "chest"
MuscleBack     MuscleGroup = "back"
MuscleLegs     MuscleGroup = "legs"
MuscleShoulders MuscleGroup = "shoulders"
MuscleArms      MuscleGroup = "arms"
MuscleCore      MuscleGroup = "core"
)

type Exercise struct {
ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
Name        string            `bson:"name" json:"name"`
Description string            `bson:"description" json:"description"`
Category    ExerciseCategory  `bson:"category" json:"category"`
MuscleGroup MuscleGroup       `bson:"muscle_group" json:"muscle_group"`
CreatedAt   time.Time         `bson:"created_at" json:"created_at"`
UpdatedAt   time.Time         `bson:"updated_at" json:"updated_at"`
}

type CreateExerciseRequest struct {
Name        string           `json:"name" binding:"required"`
Description string          `json:"description" binding:"required"`
Category    ExerciseCategory `json:"category" binding:"required"`
MuscleGroup MuscleGroup      `json:"muscle_group" binding:"required"`
}

type UpdateExerciseRequest struct {
Name        string           `json:"name"`
Description string          `json:"description"`
Category    ExerciseCategory `json:"category"`
MuscleGroup MuscleGroup      `json:"muscle_group"`
}
