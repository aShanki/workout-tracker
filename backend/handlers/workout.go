package handlers

import (
"context"
"net/http"
"strconv"
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

func (h *WorkoutHandler) GetUpcomingWorkouts(c *gin.Context) {
userID := c.MustGet("userID").(primitive.ObjectID)
days := 7 // Default to 7 days
if daysStr := c.Query("days"); daysStr != "" {
if d, err := strconv.Atoi(daysStr); err == nil && d > 0 {
days = d
}
}

now := time.Now()
end := now.AddDate(0, 0, days)

filter := bson.M{
"user_id": userID,
"status":  models.StatusPlanned,
"scheduled_at": bson.M{
"$gte": now,
"$lte": end,
},
}

opts := options.Find().SetSort(bson.D{{Key: "scheduled_at", Value: 1}})

cursor, err := h.db.Collection("workouts").Find(context.Background(), filter, opts)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch upcoming workouts"})
return
}
defer cursor.Close(context.Background())

var workouts []models.Workout
if err := cursor.All(context.Background(), &workouts); err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode workouts"})
return
}

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

func (h *WorkoutHandler) GenerateReport(c *gin.Context) {
userID := c.MustGet("userID").(primitive.ObjectID)
startDate := c.Query("start_date")
endDate := c.Query("end_date")

// Parse date range
var start, end time.Time
var err error
if startDate != "" {
start, err = time.Parse("2006-01-02", startDate)
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date format"})
return
}
} else {
start = time.Now().AddDate(0, -1, 0) // Default to last month
}

if endDate != "" {
end, err = time.Parse("2006-01-02", endDate)
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date format"})
return
}
} else {
end = time.Now()
}

// Get completed workouts in date range
filter := bson.M{
"user_id": userID,
"status":  models.StatusCompleted,
"completed_at": bson.M{
"$gte": start,
"$lte": end,
},
}

cursor, err := h.db.Collection("workouts").Find(context.Background(), filter)
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

// Calculate metrics
totalWorkouts := len(workouts)
exerciseFrequency := make(map[primitive.ObjectID]int)
categoryFrequency := make(map[string]int)
muscleGroupFrequency := make(map[string]int)

for _, workout := range workouts {
// Load exercise details for the workout
response, err := h.loadWorkoutDetails(workout)
if err != nil {
continue
}

// Map to track unique exercises per workout
uniqueExercises := make(map[primitive.ObjectID]bool)

for _, ex := range workout.Exercises {
exerciseFrequency[ex.ExerciseID]++
uniqueExercises[ex.ExerciseID] = true

// Find exercise details
for _, detail := range response.ExerciseDetails {
if detail.ID == ex.ExerciseID {
categoryFrequency[string(detail.Category)]++
muscleGroupFrequency[string(detail.MuscleGroup)]++
break
}
}
}
}

// Generate report
report := gin.H{
"period": gin.H{
"start": start,
"end":   end,
},
"summary": gin.H{
"total_workouts":        totalWorkouts,
"avg_workouts_per_week": float64(totalWorkouts) / float64(end.Sub(start).Hours()/168),
},
"category_breakdown":     categoryFrequency,
"muscle_group_breakdown": muscleGroupFrequency,
}

c.JSON(http.StatusOK, report)
}

func (h *WorkoutHandler) GetExerciseProgress(c *gin.Context) {
userID := c.MustGet("userID").(primitive.ObjectID)
exerciseID, err := primitive.ObjectIDFromHex(c.Param("exerciseId"))
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid exercise ID"})
return
}

// Get completed workouts containing this exercise
filter := bson.M{
"user_id":            userID,
"status":            models.StatusCompleted,
"exercises.exercise_id": exerciseID,
}

opts := options.Find().SetSort(bson.D{{Key: "completed_at", Value: 1}})

cursor, err := h.db.Collection("workouts").Find(context.Background(), filter, opts)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch exercise history"})
return
}
defer cursor.Close(context.Background())

var workouts []models.Workout
if err := cursor.All(context.Background(), &workouts); err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode workouts"})
return
}

type ProgressPoint struct {
Date           time.Time  `json:"date"`
MaxWeight      float64    `json:"max_weight"`
TotalVolume    float64    `json:"total_volume"` // weight * reps
TotalReps      int        `json:"total_reps"`
NumberOfSets   int        `json:"number_of_sets"`
Notes          string     `json:"notes,omitempty"`
}

var progress []ProgressPoint
for _, workout := range workouts {
if workout.CompletedAt == nil {
continue
}

for _, ex := range workout.Exercises {
if ex.ExerciseID != exerciseID {
continue
}

point := ProgressPoint{
Date:         *workout.CompletedAt,
Notes:        ex.Notes,
}

// Calculate metrics
for _, set := range ex.Sets {
point.TotalReps += set.Reps
point.NumberOfSets++
volume := float64(set.Reps) * set.Weight
point.TotalVolume += volume
if set.Weight > point.MaxWeight {
point.MaxWeight = set.Weight
}
}

progress = append(progress, point)
}
}

c.JSON(http.StatusOK, gin.H{
"exercise_id": exerciseID,
"progress":    progress,
})
}

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
