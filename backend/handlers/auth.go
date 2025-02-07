package handlers

import (
"context"
"net/http"
"time"

"github.com/gin-gonic/gin"
"go.mongodb.org/mongo-driver/bson"
"go.mongodb.org/mongo-driver/bson/primitive"
"go.mongodb.org/mongo-driver/mongo"

"workout-tracker/auth"
"workout-tracker/models"
)

type AuthHandler struct {
db *mongo.Database
}

func NewAuthHandler(db *mongo.Database) *AuthHandler {
return &AuthHandler{db: db}
}

func (h *AuthHandler) Signup(c *gin.Context) {
var input models.UserSignup

if err := c.ShouldBindJSON(&input); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}

// Check if user already exists
collection := h.db.Collection("users")
var existingUser models.User
err := collection.FindOne(context.Background(), bson.M{"email": input.Email}).Decode(&existingUser)
if err == nil {
c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
return
}

if err != mongo.ErrNoDocuments {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check existing user"})
return
}

// Hash password
hashedPassword, err := auth.HashPassword(input.Password)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
return
}

// Create user
now := time.Now()
user := models.User{
Email:     input.Email,
Password:  hashedPassword,
CreatedAt: now,
UpdatedAt: now,
}

result, err := collection.InsertOne(context.Background(), user)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
return
}

user.ID = result.InsertedID.(primitive.ObjectID)

// Generate token
token, err := auth.GenerateToken(user.ID)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
return
}

c.JSON(http.StatusCreated, models.UserResponse{
ID:        user.ID,
Email:     user.Email,
CreatedAt: user.CreatedAt,
Token:     token,
})
}

func (h *AuthHandler) Login(c *gin.Context) {
var input models.UserLogin

if err := c.ShouldBindJSON(&input); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}

// Find user
collection := h.db.Collection("users")
var user models.User
err := collection.FindOne(context.Background(), bson.M{"email": input.Email}).Decode(&user)
if err != nil {
if err == mongo.ErrNoDocuments {
c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
return
}
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find user"})
return
}

// Check password
if !auth.CheckPassword(input.Password, user.Password) {
c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
return
}

// Generate token
token, err := auth.GenerateToken(user.ID)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
return
}

c.JSON(http.StatusOK, models.UserResponse{
ID:        user.ID,
Email:     user.Email,
CreatedAt: user.CreatedAt,
Token:     token,
})
}

func (h *AuthHandler) ValidateToken(c *gin.Context) {
userID, _ := c.Get("userID")
id := userID.(primitive.ObjectID)

var user models.User
err := h.db.Collection("users").FindOne(context.Background(), bson.M{"_id": id}).Decode(&user)
if err != nil {
c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user"})
return
}

c.JSON(http.StatusOK, models.UserResponse{
ID:        user.ID,
Email:     user.Email,
CreatedAt: user.CreatedAt,
})
}
