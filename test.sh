#!/bin/bash

# Set error handling
set -e

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to install system dependencies for Playwright
install_system_deps() {
  if command_exists apt-get; then
    echo "Installing system dependencies..."
    sudo apt-get update
    sudo apt-get install -y \
      libicu-dev \
      libwebp-dev \
      libffi-dev
  else
    echo "Warning: Could not install system dependencies automatically."
    echo "Please install the required dependencies manually according to your OS."
  fi
}

# Function to run unit tests
run_unit_tests() {
  echo "Running unit tests..."
  npm test
  if [ $? -eq 0 ]; then
    echo "✅ Unit tests passed"
  else
    echo "❌ Unit tests failed"
    exit 1
  fi
}

# Function to run E2E tests
run_e2e_tests() {
  echo "Running E2E tests..."
  # Start the development server in the background
  npm run dev &
  DEV_SERVER_PID=$!
  
  # Wait for the server to be ready
  echo "Waiting for development server to start..."
  sleep 10
  
  # Run the E2E tests
  npm run test:e2e
  E2E_EXIT_CODE=$?
  
  # Kill the development server
  kill $DEV_SERVER_PID
  
  if [ $E2E_EXIT_CODE -eq 0 ]; then
    echo "✅ E2E tests passed"
  else
    echo "❌ E2E tests failed"
    exit 1
  fi
}

# Main execution
echo "🚀 Starting test suite..."

# Navigate to frontend directory
cd frontend

# Install npm dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing npm dependencies..."
  npm install
fi

# Install Playwright browsers and dependencies
echo "Installing Playwright browsers and dependencies..."
npx playwright install
npm run playwright:install-deps

# Install system dependencies
install_system_deps

# Run tests
run_unit_tests
run_e2e_tests

echo "✨ All tests passed successfully!"
exit 0
