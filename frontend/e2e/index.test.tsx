import { test, expect } from '@playwright/test';

test.describe('Workout Tracker E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('complete authentication flow', async ({ page }) => {
    // Navigate to login
    await page.getByRole('link', { name: 'Login' }).click();
    
    // Fill in login form
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify successful login
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('create new workout', async ({ page }) => {
    // Login first
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Navigate to create workout
    await page.getByRole('button', { name: 'Create Workout' }).click();
    
    // Fill workout form
    await page.getByTestId('workout-name-input').fill('Test Upper Body');
    await page.getByTestId('workout-description-input').fill('Chest and arms workout');
    
    // Add exercise
    await page.getByTestId('add-exercise-button').click();
    
    // Select exercise from dropdown
    await page.getByTestId('exercise-select-0').click();
    await page.getByText('Bench Press').click();
    
    // Add sets
    await page.getByTestId('reps-input-0-0').fill('10');
    await page.getByTestId('weight-input-0-0').fill('100');
    
    // Add another set
    await page.getByTestId('add-set-button-0').click();
    await page.getByTestId('reps-input-0-1').fill('8');
    await page.getByTestId('weight-input-0-1').fill('120');
    
    // Submit form
    await page.getByTestId('submit-button').click();
    
    // Verify workout was created
    await expect(page.getByText('Test Upper Body')).toBeVisible();
    await expect(page.getByText('Chest and arms workout')).toBeVisible();
  });

  test('manage workout status', async ({ page }) => {
    // Login first
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Find the workout
    const workoutCard = page.getByText('Test Upper Body').first();
    await expect(workoutCard).toBeVisible();
    
    // Open menu and mark as completed
    await page.getByTestId('menu-button-1').click();
    await page.getByText('Mark as Completed').click();
    
    // Verify status changed
    await expect(page.getByText('Completed')).toBeVisible();
    
    // Cancel the workout
    await page.getByTestId('menu-button-1').click();
    await page.getByText('Cancel Workout').click();
    
    // Verify status changed
    await expect(page.getByText('Cancelled')).toBeVisible();
  });

  test('delete workout', async ({ page }) => {
    // Login first
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Find and delete the workout
    const workoutCard = page.getByText('Test Upper Body').first();
    await expect(workoutCard).toBeVisible();
    
    await page.getByTestId('menu-button-1').click();
    await page.getByText('Delete').click();
    
    // Verify workout was deleted
    await expect(page.getByText('Test Upper Body')).not.toBeVisible();
  });
});
