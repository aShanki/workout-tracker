package handlers

import (
"context"
"net/http"
"time"

"github.com/gin-gonic/gin"
"go.mongodb.org/mongo-driver/bson"
"go.mongodb.org/mongo-driver/bson/primitive"
"go.mongodb.org/mongo-driver/mongo"
"go.mongodb.org/mongo-driver/mongo/options"

"workout-tracker/models"
)

type ExerciseHandler struct {
db *mongo.Database
}

func NewExerciseHandler(db *mongo.Database) *ExerciseHandler {
return &ExerciseHandler{db: db}
}

func (h *ExerciseHandler) CreateExercise(c *gin.Context) {
var input models.CreateExerciseRequest

if err := c.ShouldBindJSON(&input); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}

// Create exercise
now := time.Now()
exercise := models.Exercise{
Name:        input.Name,
Description: input.Description,
Category:    input.Category,
MuscleGroup: input.MuscleGroup,
CreatedAt:   now,
UpdatedAt:   now,
}

result, err := h.db.Collection("exercises").InsertOne(context.Background(), exercise)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create exercise"})
return
}

exercise.ID = result.InsertedID.(primitive.ObjectID)
c.JSON(http.StatusCreated, exercise)
}

func (h *ExerciseHandler) ListExercises(c *gin.Context) {
// Optional query parameters for filtering
category := c.Query("category")
muscleGroup := c.Query("muscle_group")

// Build filter
filter := bson.M{}
if category != "" {
filter["category"] = category
}
if muscleGroup != "" {
filter["muscle_group"] = muscleGroup
}

// Configure options for sorting and pagination
opts := options.Find().
SetSort(bson.D{{Key: "name", Value: 1}})

cursor, err := h.db.Collection("exercises").Find(context.Background(), filter, opts)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch exercises"})
return
}
defer cursor.Close(context.Background())

var exercises []models.Exercise
if err := cursor.All(context.Background(), &exercises); err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode exercises"})
return
}

c.JSON(http.StatusOK, exercises)
}

func (h *ExerciseHandler) GetExercise(c *gin.Context) {
id, err := primitive.ObjectIDFromHex(c.Param("id"))
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid exercise ID"})
return
}

var exercise models.Exercise
err = h.db.Collection("exercises").FindOne(context.Background(), bson.M{"_id": id}).Decode(&exercise)
if err != nil {
if err == mongo.ErrNoDocuments {
c.JSON(http.StatusNotFound, gin.H{"error": "Exercise not found"})
return
}
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch exercise"})
return
}

c.JSON(http.StatusOK, exercise)
}

// Seed initial exercises into the database
func (h *ExerciseHandler) SeedExercises(c *gin.Context) {
exercises := []interface{}{
models.Exercise{
Name:        "Push-ups",
Description: "A bodyweight exercise that works the chest, shoulders, and triceps",
Category:    models.CategoryStrength,
MuscleGroup: models.MuscleChest,
CreatedAt:   time.Now(),
UpdatedAt:   time.Now(),
},
models.Exercise{
Name:        "Pull-ups",
Description: "A bodyweight exercise that targets the back and biceps",
Category:    models.CategoryStrength,
MuscleGroup: models.MuscleBack,
CreatedAt:   time.Now(),
UpdatedAt:   time.Now(),
},
models.Exercise{
Name:        "Squats",
Description: "A compound exercise that works the legs and core",
Category:    models.CategoryStrength,
MuscleGroup: models.MuscleLegs,
CreatedAt:   time.Now(),
UpdatedAt:   time.Now(),
},
models.Exercise{
Name:        "Running",
Description: "Cardiovascular exercise for endurance and fat burning",
Category:    models.CategoryCardio,
MuscleGroup: models.MuscleLegs,
CreatedAt:   time.Now(),
UpdatedAt:   time.Now(),
},
}

result, err := h.db.Collection("exercises").InsertMany(context.Background(), exercises)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to seed exercises"})
return
}

c.JSON(http.StatusCreated, gin.H{"message": "Exercises seeded successfully", "count": len(result.InsertedIDs)})
}
