import { test, expect } from '@playwright/test';
import { login, seedTestData } from './utils';

test.describe('Exercise Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await seedTestData(page);
  });

  test('should display seeded exercises in workout form', async ({ page }) => {
    // Navigate to create workout
    await page.getByTestId('create-workout-button').click();
    await page.waitForURL('**/workout/create');
    await expect(page.getByTestId('workout-form')).toBeVisible();

    // Add exercise button should be visible
    await expect(page.getByTestId('add-exercise-button')).toBeVisible();

    // Click add exercise
    await page.getByTestId('add-exercise-button').click();
    await page.getByTestId('exercise-select-0').click();

    // Should see seeded exercises in dropdown
    await expect(page.getByRole('option', { name: 'Bench Press' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Squat' })).toBeVisible();
  });

  test('should show exercise details when selected', async ({ page }) => {
    await page.getByTestId('create-workout-button').click();
    await page.waitForURL('**/workout/create');

    // Add exercise and select bench press
    await page.getByTestId('add-exercise-button').click();
    await page.getByTestId('exercise-select-0').click();
    await page.getByRole('option', { name: 'Bench Press' }).click();

    // Should show exercise details
    const exerciseDetails = page.locator('[data-testid="exercise-details-0"]');
    await expect(exerciseDetails).toContainText('Bench Press');
    await expect(exerciseDetails).toContainText('Barbell bench press');
    await expect(exerciseDetails).toContainText('Chest');
  });

  test('should maintain exercise selection after page reload', async ({ page }) => {
    await page.getByTestId('create-workout-button').click();
    await page.waitForURL('**/workout/create');

    // Add and select exercise
    await page.getByTestId('add-exercise-button').click();
    await page.getByTestId('exercise-select-0').click();
    await page.getByRole('option', { name: 'Bench Press' }).click();

    // Add set data
    await page.getByTestId('reps-input-0-0').fill('10');
    await page.getByTestId('weight-input-0-0').fill('100');

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Exercise and set data should persist
    const exerciseDetails = page.locator('[data-testid="exercise-details-0"]');
    await expect(exerciseDetails).toContainText('Bench Press');
    await expect(page.getByTestId('reps-input-0-0')).toHaveValue('10');
    await expect(page.getByTestId('weight-input-0-0')).toHaveValue('100');
  });

  test('should allow multiple exercises in workout', async ({ page }) => {
    await page.getByTestId('create-workout-button').click();
    await page.waitForURL('**/workout/create');

    // Add first exercise (Bench Press)
    await page.getByTestId('add-exercise-button').click();
    await page.getByTestId('exercise-select-0').click();
    await page.getByRole('option', { name: 'Bench Press' }).click();
    await page.getByTestId('reps-input-0-0').fill('10');
    await page.getByTestId('weight-input-0-0').fill('100');

    // Add second exercise (Squat)
    await page.getByTestId('add-exercise-button').click();
    await page.getByTestId('exercise-select-1').click();
    await page.getByRole('option', { name: 'Squat' }).click();
    await page.getByTestId('reps-input-1-0').fill('8');
    await page.getByTestId('weight-input-1-0').fill('150');

    // Verify both exercises are present
    await expect(page.locator('[data-testid="exercise-details-0"]')).toContainText('Bench Press');
    await expect(page.locator('[data-testid="exercise-details-1"]')).toContainText('Squat');
  });
});