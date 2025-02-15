package main

import (
"context"
"log"
"os"
"time"

"github.com/gin-gonic/gin"
"go.mongodb.org/mongo-driver/mongo"
"go.mongodb.org/mongo-driver/mongo/options"

"workout-tracker/auth"
"workout-tracker/handlers"
)

func initMongoDB() (*mongo.Database, error) {
ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()

mongoURI := os.Getenv("MONGO_URI")
if mongoURI == "" {
mongoURI = "mongodb://mongo:27017/fitness_tracker"
}

client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
if err != nil {
return nil, err
}

err = client.Ping(ctx, nil)
if err != nil {
return nil, err
}

return client.Database("fitness_tracker"), nil
}

func setupRouter(db *mongo.Database) *gin.Engine {
r := gin.Default()

// Initialize handlers
authHandler := handlers.NewAuthHandler(db)
exerciseHandler := handlers.NewExerciseHandler(db)
workoutHandler := handlers.NewWorkoutHandler(db)

// CORS middleware
r.Use(func(c *gin.Context) {
c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Authorization, Content-Type")

if c.Request.Method == "OPTIONS" {
c.AbortWithStatus(204)
return
}

c.Next()
})

// Health check endpoint
r.GET("/health", func(c *gin.Context) {
c.JSON(200, gin.H{"status": "ok"})
})

// API v1 routes
v1 := r.Group("/api/v1")
{
// Auth routes
authRoutes := v1.Group("/auth")
{
authRoutes.POST("/signup", authHandler.Signup)
authRoutes.POST("/login", authHandler.Login)
authRoutes.GET("/validate", auth.AuthMiddleware(), authHandler.ValidateToken)
}

// Protected routes
protected := v1.Group("/")
protected.Use(auth.AuthMiddleware())
{
// Workout routes
workouts := protected.Group("/workouts")
{
workouts.POST("/", workoutHandler.CreateWorkout)
workouts.GET("/", workoutHandler.ListWorkouts)
workouts.GET("/:id", workoutHandler.GetWorkout)
workouts.PUT("/:id", workoutHandler.UpdateWorkout)
workouts.DELETE("/:id", workoutHandler.DeleteWorkout)

// New workout-related endpoints
workouts.GET("/upcoming", workoutHandler.GetUpcomingWorkouts)
workouts.GET("/report", workoutHandler.GenerateReport)
workouts.GET("/exercise/:exerciseId/progress", workoutHandler.GetExerciseProgress)
}

// Exercise routes
exercises := protected.Group("/exercises")
{
exercises.POST("/", exerciseHandler.CreateExercise)
exercises.GET("/", exerciseHandler.ListExercises)
exercises.GET("/:id", exerciseHandler.GetExercise)
}

// Admin routes
admin := protected.Group("/admin")
{
admin.POST("/exercises/seed", exerciseHandler.SeedExercises)
}
}
}

return r
}

func main() {
db, err := initMongoDB()
if err != nil {
log.Fatalf("Failed to connect to MongoDB: %v", err)
}

r := setupRouter(db)

port := os.Getenv("PORT")
if port == "" {
port = "8080"
}

if err := r.Run(":" + port); err != nil {
log.Fatalf("Failed to start server: %v", err)
}
}
