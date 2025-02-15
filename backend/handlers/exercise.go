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

// defaultExercises returns a comprehensive list of exercise definitions
func defaultExercises() []models.Exercise {
	now := time.Now()
	return []models.Exercise{
		// Strength - Chest
		{
			Name:        "Bench Press",
			Description: "A compound exercise that targets the chest, front deltoids, and triceps",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleChest,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			Name:        "Push-ups",
			Description: "A bodyweight exercise that works the chest, shoulders, and triceps",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleChest,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			Name:        "Dumbbell Flyes",
			Description: "An isolation exercise that targets the chest muscles",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleChest,
			CreatedAt:   now,
			UpdatedAt:   now,
		},

		// Strength - Back
		{
			Name:        "Pull-ups",
			Description: "A bodyweight exercise that targets the back and biceps",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleBack,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			Name:        "Barbell Rows",
			Description: "A compound exercise that works the back muscles and biceps",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleBack,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			Name:        "Lat Pulldowns",
			Description: "A machine exercise targeting the latissimus dorsi muscles",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleBack,
			CreatedAt:   now,
			UpdatedAt:   now,
		},

		// Strength - Legs
		{
			Name:        "Squats",
			Description: "A compound exercise that works the legs and core",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleLegs,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			Name:        "Deadlifts",
			Description: "A compound exercise targeting the posterior chain",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleLegs,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			Name:        "Lunges",
			Description: "A unilateral exercise for leg strength and balance",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleLegs,
			CreatedAt:   now,
			UpdatedAt:   now,
		},

		// Strength - Shoulders
		{
			Name:        "Overhead Press",
			Description: "A compound exercise for shoulder strength and development",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleShoulders,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			Name:        "Lateral Raises",
			Description: "An isolation exercise for the lateral deltoids",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleShoulders,
			CreatedAt:   now,
			UpdatedAt:   now,
		},

		// Strength - Arms
		{
			Name:        "Bicep Curls",
			Description: "An isolation exercise for the biceps muscles",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleArms,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			Name:        "Tricep Extensions",
			Description: "An isolation exercise targeting the triceps",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleArms,
			CreatedAt:   now,
			UpdatedAt:   now,
		},

		// Strength - Core
		{
			Name:        "Planks",
			Description: "An isometric exercise for core strength and stability",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleCore,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			Name:        "Russian Twists",
			Description: "A rotational exercise for the obliques and core",
			Category:    models.CategoryStrength,
			MuscleGroup: models.MuscleCore,
			CreatedAt:   now,
			UpdatedAt:   now,
		},

		// Cardio
		{
			Name:        "Running",
			Description: "Cardiovascular exercise for endurance and fat burning",
			Category:    models.CategoryCardio,
			MuscleGroup: models.MuscleLegs,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			Name:        "Cycling",
			Description: "Low-impact cardio exercise for endurance",
			Category:    models.CategoryCardio,
			MuscleGroup: models.MuscleLegs,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			Name:        "Jump Rope",
			Description: "High-intensity cardio exercise for coordination and endurance",
			Category:    models.CategoryCardio,
			MuscleGroup: models.MuscleLegs,
			CreatedAt:   now,
			UpdatedAt:   now,
		},

		// Flexibility
		{
			Name:        "Yoga Flow",
			Description: "A series of poses for flexibility and mindfulness",
			Category:    models.CategoryFlexibility,
			MuscleGroup: models.MuscleCore,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			Name:        "Dynamic Stretching",
			Description: "Active stretching exercises for improved mobility",
			Category:    models.CategoryFlexibility,
			MuscleGroup: models.MuscleCore,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
	}
}

// SeedExercises seeds the database with default exercises if they don't already exist
func (h *ExerciseHandler) SeedExercises(c *gin.Context) {
	ctx := context.Background()
	coll := h.db.Collection("exercises")

	// Get existing exercise names for idempotency check
	existingNames := make(map[string]bool)
	cursor, err := coll.Find(ctx, bson.M{}, options.Find().SetProjection(bson.M{"name": 1}))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch existing exercises"})
		return
	}
	defer cursor.Close(ctx)

	var existingExercises []struct{ Name string }
	if err := cursor.All(ctx, &existingExercises); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode existing exercises"})
		return
	}

	for _, ex := range existingExercises {
		existingNames[ex.Name] = true
	}

	// Filter out exercises that already exist
	exercises := defaultExercises()
	var newExercises []interface{}
	for _, exercise := range exercises {
		if !existingNames[exercise.Name] {
			newExercises = append(newExercises, exercise)
		}
	}

	// If no new exercises to add, return early
	if len(newExercises) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"message": "No new exercises to seed",
			"count":   0,
		})
		return
	}

	// Insert new exercises
	result, err := coll.InsertMany(ctx, newExercises)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to seed exercises"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Exercises seeded successfully",
		"count":   len(result.InsertedIDs),
	})
}
