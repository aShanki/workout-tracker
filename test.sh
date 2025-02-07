#!/bin/bash

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check and install system dependencies for Playwright
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

# Run unit tests
echo "Running unit tests..."
npm test

# Check if unit tests passed
if [ $? -ne 0 ]; then
  echo "Unit tests failed"
  exit 1
fi

# Run E2E tests
echo "Running E2E tests..."
npm run test:e2e

# Check if E2E tests passed
if [ $? -ne 0 ]; then
  echo "E2E tests failed"
  exit 1
fi

echo "All tests passed successfully!"
exit 0
