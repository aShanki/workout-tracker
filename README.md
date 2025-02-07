# Workout Tracker Application

A full-stack application for tracking workouts, with authentication, exercise management, and workout planning capabilities.

## Technology Stack

- **Backend**:
  - Go with Gin framework
  - MongoDB for database
  - JWT for authentication

- **Frontend**:
  - Next.js
  - Mantine UI components
  - TypeScript

## Project Structure

```
.
├── backend/
│   ├── auth/           # Authentication middleware and utilities
│   ├── handlers/       # API route handlers
│   ├── models/         # Data models
│   ├── Dockerfile
│   ├── main.go        # Entry point
│   └── .env           # Backend configuration
├── frontend/
│   ├── app/           # Next.js app directory
│   │   ├── components/  # React components
│   │   ├── providers/   # Context providers
│   │   ├── services/   # API services
│   │   └── types/      # TypeScript definitions
│   ├── Dockerfile
│   └── .env           # Frontend configuration
└── docker-compose.yml # Container orchestration
```

## Features

- User authentication (signup/login)
- Exercise management
- Workout planning and tracking
- Progress history
- Containerized development and deployment

## Getting Started

1. **Prerequisites**
   - Docker and Docker Compose
   - Make (optional, for using Makefile commands)

2. **Environment Setup**
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Adjust environment variables as needed

3. **Running the Application**
   ```bash
   # Start all services
   docker-compose up -d

   # Seed initial exercise data (optional)
   curl -X POST http://localhost:8080/api/v1/admin/exercises/seed

   # Stop all services
   docker-compose down
   ```

4. **Accessing the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/api/v1/docs

## Development

1. **Backend Development**
   ```bash
   # Run backend tests
   cd backend && go test ./...
   ```

2. **Frontend Development**
   ```bash
   # Install dependencies
   cd frontend && npm install

   # Run development server
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/v1/auth/signup` - Create a new user account
- POST `/api/v1/auth/login` - Login to existing account
- GET `/api/v1/auth/validate` - Validate JWT token

### Exercises
- GET `/api/v1/exercises` - List all exercises
- GET `/api/v1/exercises/:id` - Get exercise details
- POST `/api/v1/exercises` - Create new exercise
- POST `/api/v1/admin/exercises/seed` - Seed initial exercises

### Workouts
- GET `/api/v1/workouts` - List user's workouts
- POST `/api/v1/workouts` - Create new workout
- GET `/api/v1/workouts/:id` - Get workout details
- PUT `/api/v1/workouts/:id` - Update workout
- DELETE `/api/v1/workouts/:id` - Delete workout

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
