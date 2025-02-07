#!/bin/bash

# Run backend tests
echo "Running backend tests..."
cd backend && go test ./... -v

# Store the backend test result
BACKEND_RESULT=$?

# Run frontend tests
echo "Running frontend tests..."
cd ../frontend && npm test

# Store the frontend test result
FRONTEND_RESULT=$?

# Exit with failure if either test suite failed
if [ $BACKEND_RESULT -ne 0 ] || [ $FRONTEND_RESULT -ne 0 ]; then
    exit 1
fi
