import { test, expect } from '@playwright/test';

test.describe('Workout Tracker E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Initialize test state by injecting script
    await page.addInitScript(() => {
      window.__testState = {
        workouts: [{
          id: '1',
          name: 'Test E2E Workout',
          description: 'Created during E2E test',
          exercises: [
            {
              exerciseId: '1',
              sets: [
                { reps: 10, weight: 100 },
                { reps: 8, weight: 110 }
              ],
              notes: ''
            }
          ]
        }],
        initialized: true
      };
    });

    // Reload to apply the state
    await page.reload();
  });

  test('complete authentication flow', async ({ page }) => {
    await expect(page.getByTestId('login-form')).toBeVisible();

    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Should find either the workout list or empty state
    const listLocator = page.locator('[data-testid="workout-list"], [data-testid="empty-workout-list"]').first();
    await expect(listLocator).toBeVisible({ timeout: 10000 });
  });

  test('create new workout', async ({ page }) => {
    // Login
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for initial list
    const initialStateLocator = page.locator(
      '[data-testid="workout-list"], [data-testid="empty-workout-list"], [data-testid="workout-list-loading"]'
    ).first();
    await expect(initialStateLocator).toBeVisible({ timeout: 10000 });

    // Navigate to create workout
    await page.getByTestId('create-workout-button').click();
    await page.waitForURL('**/workout/create');

    // Fill in workout details
    const form = page.getByTestId('workout-form');
    await expect(form).toBeVisible({ timeout: 10000 });
    await page.getByTestId('workout-name-input').fill('New E2E Workout');
    await page.getByTestId('workout-description-input').fill('Created during create test');

    // Add exercise
    await page.getByTestId('add-exercise-button').click();
    await page.getByTestId('exercise-select-0').click();
    await page.waitForTimeout(500);
    await page.getByRole('option', { name: 'Bench Press' }).click();

    // Fill in set details
    await page.getByTestId('reps-input-0-0').fill('10');
    await page.getByTestId('weight-input-0-0').fill('100');

    // Add another set
    await page.getByTestId('add-set-button-0').click();
    await page.getByTestId('reps-input-0-1').fill('8');
    await page.getByTestId('weight-input-0-1').fill('110');

    // Submit and wait for navigation
    await page.getByTestId('submit-button').click();
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');

    // Wait for any loading states to clear
    await page.getByTestId('workout-list-loading').waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});

    // Verify workout list
    const workoutList = page.getByTestId('workout-list');
    await expect(workoutList).toBeVisible({ timeout: 10000 });

    // Verify new workout appears
    const workoutCard = page.locator('[data-testid="workout-card"]').filter({ hasText: 'New E2E Workout' });
    await expect(workoutCard).toBeVisible({ timeout: 10000 });
    await expect(workoutCard).toContainText('Created during create test');
  });

  test('view workout details', async ({ page }) => {
    // Login
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for loading state to clear
    await page.getByTestId('workout-list-loading').waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});

    // Wait for workout list
    const workoutList = page.getByTestId('workout-list');
    await expect(workoutList).toBeVisible({ timeout: 10000 });

    // Verify initial workout details
    const workoutCard = page.getByTestId('workout-card').first();
    await expect(workoutCard).toBeVisible({ timeout: 10000 });
    await expect(workoutCard).toContainText('Test E2E Workout');
    await expect(workoutCard).toContainText('Created during E2E test');

    // Verify set details
    await expect(page.getByTestId('workout-set-0-0')).toContainText('10 reps × 100 kg');
    await expect(page.getByTestId('workout-set-0-1')).toContainText('8 reps × 110 kg');
  });
});
