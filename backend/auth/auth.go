package auth

import (
"errors"
"os"
"time"

"github.com/gin-gonic/gin"
"github.com/golang-jwt/jwt/v5"
"go.mongodb.org/mongo-driver/bson/primitive"
"golang.org/x/crypto/bcrypt"
)

var (
ErrInvalidToken = errors.New("invalid token")
ErrTokenExpired = errors.New("token expired")
)

type Claims struct {
UserID primitive.ObjectID `json:"user_id"`
jwt.RegisteredClaims
}

func GenerateToken(userID primitive.ObjectID) (string, error) {
secret := os.Getenv("JWT_SECRET")
if secret == "" {
secret = "your_jwt_secret_here" // default secret for development
}

claims := &Claims{
UserID: userID,
RegisteredClaims: jwt.RegisteredClaims{
ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
IssuedAt:  jwt.NewNumericDate(time.Now()),
},
}

token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
return token.SignedString([]byte(secret))
}

func ValidateToken(tokenString string) (*Claims, error) {
secret := os.Getenv("JWT_SECRET")
if secret == "" {
secret = "your_jwt_secret_here" // default secret for development
}

token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
return []byte(secret), nil
})

if err != nil {
if errors.Is(err, jwt.ErrTokenExpired) {
return nil, ErrTokenExpired
}
return nil, ErrInvalidToken
}

if claims, ok := token.Claims.(*Claims); ok && token.Valid {
return claims, nil
} else {
return nil, ErrInvalidToken
}
}

func HashPassword(password string) (string, error) {
bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
if err != nil {
return "", err
}
return string(bytes), nil
}

func CheckPassword(password, hash string) bool {
err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
return err == nil
}

func AuthMiddleware() gin.HandlerFunc {
return func(c *gin.Context) {
auth := c.GetHeader("Authorization")
if auth == "" {
c.AbortWithStatusJSON(401, gin.H{"error": "Authorization header required"})
return
}

// Remove "Bearer " prefix if present
if len(auth) > 7 && auth[:7] == "Bearer " {
auth = auth[7:]
}

claims, err := ValidateToken(auth)
if err != nil {
if errors.Is(err, ErrTokenExpired) {
c.AbortWithStatusJSON(401, gin.H{"error": "Token expired"})
} else {
c.AbortWithStatusJSON(401, gin.H{"error": "Invalid token"})
}
return
}

// Set user ID in context for protected routes
c.Set("userID", claims.UserID)
c.Next()
}
}
