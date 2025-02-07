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

type WorkoutHandler struct {
db *mongo.Database
}

func NewWorkoutHandler(db *mongo.Database) *WorkoutHandler {
return &WorkoutHandler{db: db}
}

func (h *WorkoutHandler) CreateWorkout(c *gin.Context) {
userID, _ := c.Get("userID")
var input models.CreateWorkoutRequest

if err := c.ShouldBindJSON(&input); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}

// Validate that all exercise IDs exist
for _, exercise := range input.Exercises {
if _, err := primitive.ObjectIDFromHex(exercise.ExerciseID.Hex()); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid exercise ID format"})
return
}
}

// Create workout
now := time.Now()
workout := models.Workout{
UserID:      userID.(primitive.ObjectID),
Name:        input.Name,
Description: input.Description,
Exercises:   input.Exercises,
Status:      models.StatusPlanned,
ScheduledAt: input.ScheduledAt,
CreatedAt:   now,
UpdatedAt:   now,
}

result, err := h.db.Collection("workouts").InsertOne(context.Background(), workout)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create workout"})
return
}

workout.ID = result.InsertedID.(primitive.ObjectID)

// Load exercise details for response
response, err := h.loadWorkoutDetails(workout)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load workout details"})
return
}

c.JSON(http.StatusCreated, response)
}

func (h *WorkoutHandler) ListWorkouts(c *gin.Context) {
userID := c.MustGet("userID").(primitive.ObjectID)
status := c.Query("status")

// Build filter
filter := bson.M{"user_id": userID}
if status != "" {
filter["status"] = status
}

// Configure options for sorting by scheduled date
opts := options.Find().
SetSort(bson.D{{Key: "scheduled_at", Value: 1}})

cursor, err := h.db.Collection("workouts").Find(context.Background(), filter, opts)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch workouts"})
return
}
defer cursor.Close(context.Background())

var workouts []models.Workout
if err := cursor.All(context.Background(), &workouts); err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode workouts"})
return
}

// Load exercise details for each workout
var response []models.WorkoutResponse
for _, workout := range workouts {
workoutResponse, err := h.loadWorkoutDetails(workout)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load workout details"})
return
}
response = append(response, workoutResponse)
}

c.JSON(http.StatusOK, response)
}

func (h *WorkoutHandler) GetWorkout(c *gin.Context) {
userID := c.MustGet("userID").(primitive.ObjectID)
workoutID, err := primitive.ObjectIDFromHex(c.Param("id"))
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid workout ID"})
return
}

var workout models.Workout
err = h.db.Collection("workouts").FindOne(context.Background(), 
bson.M{"_id": workoutID, "user_id": userID}).Decode(&workout)
if err != nil {
if err == mongo.ErrNoDocuments {
c.JSON(http.StatusNotFound, gin.H{"error": "Workout not found"})
return
}
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch workout"})
return
}

// Load exercise details
response, err := h.loadWorkoutDetails(workout)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load workout details"})
return
}

c.JSON(http.StatusOK, response)
}

func (h *WorkoutHandler) UpdateWorkout(c *gin.Context) {
userID := c.MustGet("userID").(primitive.ObjectID)
workoutID, err := primitive.ObjectIDFromHex(c.Param("id"))
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid workout ID"})
return
}

var input models.UpdateWorkoutRequest
if err := c.ShouldBindJSON(&input); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}

// Build update document
update := bson.M{"updated_at": time.Now()}
if input.Name != "" {
update["name"] = input.Name
}
if input.Description != "" {
update["description"] = input.Description
}
if input.Exercises != nil {
update["exercises"] = input.Exercises
}
if input.Status != "" {
update["status"] = input.Status
if input.Status == models.StatusCompleted {
now := time.Now()
update["completed_at"] = now
}
}
if input.ScheduledAt != nil {
update["scheduled_at"] = input.ScheduledAt
}

result := h.db.Collection("workouts").FindOneAndUpdate(
context.Background(),
bson.M{"_id": workoutID, "user_id": userID},
bson.M{"$set": update},
options.FindOneAndUpdate().SetReturnDocument(options.After),
)

var workout models.Workout
if err := result.Decode(&workout); err != nil {
if err == mongo.ErrNoDocuments {
c.JSON(http.StatusNotFound, gin.H{"error": "Workout not found"})
return
}
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update workout"})
return
}

// Load exercise details
response, err := h.loadWorkoutDetails(workout)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load workout details"})
return
}

c.JSON(http.StatusOK, response)
}

func (h *WorkoutHandler) DeleteWorkout(c *gin.Context) {
userID := c.MustGet("userID").(primitive.ObjectID)
workoutID, err := primitive.ObjectIDFromHex(c.Param("id"))
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid workout ID"})
return
}

result, err := h.db.Collection("workouts").DeleteOne(context.Background(), 
bson.M{"_id": workoutID, "user_id": userID})
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete workout"})
return
}

if result.DeletedCount == 0 {
c.JSON(http.StatusNotFound, gin.H{"error": "Workout not found"})
return
}

c.JSON(http.StatusOK, gin.H{"message": "Workout deleted successfully"})
}

// Helper function to load exercise details for a workout
func (h *WorkoutHandler) loadWorkoutDetails(workout models.Workout) (models.WorkoutResponse, error) {
response := models.WorkoutResponse{
Workout: workout,
}

// Get all exercise IDs
var exerciseIDs []primitive.ObjectID
for _, ex := range workout.Exercises {
exerciseIDs = append(exerciseIDs, ex.ExerciseID)
}

// Fetch exercise details
cursor, err := h.db.Collection("exercises").Find(context.Background(), 
bson.M{"_id": bson.M{"$in": exerciseIDs}})
if err != nil {
return response, err
}
defer cursor.Close(context.Background())

var exercises []models.Exercise
if err := cursor.All(context.Background(), &exercises); err != nil {
return response, err
}

response.ExerciseDetails = exercises
return response, nil
}
