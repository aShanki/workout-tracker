# Workout Tracker

A full-stack web application for tracking workouts, built with Next.js, Go, and MongoDB.

## Features

- User authentication and authorization with JWT
- Create and manage workouts
- Track exercises, sets, and reps
- Schedule workouts and track progress
- Generate workout reports and analytics
- Comprehensive exercise database with various categories and muscle groups

## Technology Stack

- Frontend: Next.js, TypeScript, Mantine UI
- Backend: Go, Gin framework
- Database: MongoDB
- Testing: Jest, React Testing Library, Playwright

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Go (v1.21 or later)
- MongoDB (v6 or later)
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/workout-tracker.git
cd workout-tracker
```

2. Install dependencies:
```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
go mod download
```

3. Set up environment variables:
```bash
# Frontend (.env)
cp frontend/.env.example frontend/.env

# Backend (.env)
cp backend/.env.example backend/.env
```

4. Configure MongoDB:
- Set `MONGO_URI` in backend/.env (default: "mongodb://mongo:27017/fitness_tracker")
- For local development without Docker, use "mongodb://localhost:27017/fitness_tracker"

### Running the Application

Using Docker:
```bash
docker-compose up
```

Without Docker:
```bash
# Start MongoDB (make sure it's installed and running)
mongod

# Start backend (in backend directory)
go run main.go

# Start frontend (in frontend directory)
npm run dev
```

### Initialize Exercise Database

The application comes with a comprehensive exercise database. To seed it:

```bash
# Using curl
curl -X POST http://localhost:8080/api/v1/admin/exercises/seed

# Or through the frontend application after logging in as admin
```

## API Documentation

The API is documented using OpenAPI Specification 3.0. You can find the full documentation in `backend/openapi.yaml`.

To view the API documentation:
1. Copy the contents of `backend/openapi.yaml`
2. Visit [Swagger Editor](https://editor.swagger.io/)
3. Paste the contents to view the interactive documentation

Key API features:
- JWT-based authentication
- CRUD operations for workouts
- Exercise management
- Workout scheduling
- Progress tracking and reports

## Reports and Analytics

The application provides various reports and analytics:

1. Workout History
- View past workouts with detailed exercise information
- Filter by date range, exercise type, or muscle group
- Track progress over time

2. Progress Tracking
- Visual representations of weight/rep progression
- Personal records tracking
- Volume and intensity metrics

3. Workout Scheduling
- Schedule future workouts
- Get reminders and notifications
- View upcoming workout calendar

## Testing

The project includes both unit tests and end-to-end tests.

### Running Tests

To run all tests (unit and E2E):
```bash
./test.sh
```

### Unit Tests

Unit tests are written using Jest and React Testing Library.

```bash
# Run unit tests
cd frontend
npm test

# Run tests in watch mode
npm run test:watch
```

### End-to-End Tests

E2E tests are written using Playwright.

```bash
# Run E2E tests
cd frontend
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug
```

### Writing Tests

#### Unit Tests
- Tests are located next to their components in `__tests__` directories
- Use React Testing Library for component testing
- Follow the Arrange-Act-Assert pattern

Example:
```typescript
import { render, screen } from '../../../test/test-utils';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

#### E2E Tests
- E2E tests are located in `frontend/e2e` directory
- Use Playwright's Page Object Model when applicable
- Test complete user journeys

Example:
```typescript
import { test, expect } from '@playwright/test';

test('user can create a workout', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Create Workout');
  await page.fill('[data-testid="workout-name"]', 'Test Workout');
  await page.click('text=Save');
  await expect(page.getByText('Workout created')).toBeVisible();
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
