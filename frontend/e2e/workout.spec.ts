import { test, expect } from '@playwright/test';
import { login, seedTestData, clearTestData } from './utils';

test.describe('Workout Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await clearTestData(page);
  });

  test('should create new workout', async ({ page }) => {
    await page.getByTestId('create-workout-button').click();
    await page.waitForURL('**/workout/create');

    await page.getByTestId('workout-name-input').fill('New Test Workout');
    await page.getByTestId('workout-description-input').fill('Created in E2E test');
    
    await page.getByTestId('add-exercise-button').click();
    await page.getByTestId('exercise-select-0').click();
    await page.getByRole('option', { name: 'Bench Press' }).click();

    await page.getByTestId('reps-input-0-0').fill('10');
    await page.getByTestId('weight-input-0-0').fill('100');
    await page.getByTestId('add-set-button-0').click();
    await page.getByTestId('reps-input-0-1').fill('8');
    await page.getByTestId('weight-input-0-1').fill('110');

    await page.getByTestId('submit-button').click();
    await page.waitForURL('**/');

    const workoutCard = page.locator('[data-testid="workout-card"]').filter({ hasText: 'New Test Workout' });
    await expect(workoutCard).toBeVisible();
    await expect(workoutCard).toContainText('Created in E2E test');
  });

  test('should schedule workout', async ({ page }) => {
    await page.getByTestId('create-workout-button').click();
    await page.getByTestId('workout-name-input').fill('Scheduled Workout');
    await page.getByTestId('workout-description-input').fill('Testing scheduling');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.getByTestId('schedule-date-input').fill(tomorrow.toISOString().split('T')[0]);
    
    await page.getByTestId('add-exercise-button').click();
    await page.getByTestId('exercise-select-0').click();
    await page.getByRole('option', { name: 'Squat' }).click();
    await page.getByTestId('reps-input-0-0').fill('5');
    await page.getByTestId('weight-input-0-0').fill('150');
    
    await page.getByTestId('submit-button').click();
    await page.waitForURL('**/');

    const workoutCard = page.locator('[data-testid="workout-card"]').filter({ hasText: 'Scheduled Workout' });
    await expect(workoutCard).toBeVisible();
    await expect(workoutCard).toContainText('Testing scheduling');
    await expect(workoutCard).toContainText(tomorrow.toISOString().split('T')[0]);
  });

  test('should update existing workout', async ({ page }) => {
    await seedTestData(page);
    
    await page.getByTestId('workout-card').first().getByTestId('edit-workout-button').click();
    await page.waitForURL('**/workout/*/edit');

    await page.getByTestId('workout-name-input').clear();
    await page.getByTestId('workout-name-input').fill('Updated Workout Name');
    await page.getByTestId('workout-description-input').clear();
    await page.getByTestId('workout-description-input').fill('Updated in E2E test');

    await page.getByTestId('reps-input-0-0').clear();
    await page.getByTestId('reps-input-0-0').fill('12');
    await page.getByTestId('weight-input-0-0').clear();
    await page.getByTestId('weight-input-0-0').fill('120');

    await page.getByTestId('submit-button').click();
    await page.waitForURL('**/');

    const updatedCard = page.locator('[data-testid="workout-card"]').filter({ hasText: 'Updated Workout Name' });
    await expect(updatedCard).toBeVisible();
    await expect(updatedCard).toContainText('Updated in E2E test');
    await expect(updatedCard).toContainText('12 reps × 120 kg');
  });

  test('should delete workout', async ({ page }) => {
    await seedTestData(page);
    
    const initialWorkouts = await page.locator('[data-testid="workout-card"]').count();
    await page.getByTestId('workout-card').first().getByTestId('delete-workout-button').click();
    await page.getByTestId('confirm-delete-button').click();
    
    const remainingWorkouts = await page.locator('[data-testid="workout-card"]').count();
    expect(remainingWorkouts).toBe(initialWorkouts - 1);
  });

  test('should view workout history', async ({ page }) => {
    await seedTestData(page);
    
    await page.getByTestId('workout-history-button').click();
    await expect(page.getByTestId('workout-history-list')).toBeVisible();
    
    const historyItems = await page.locator('[data-testid="workout-history-item"]').count();
    expect(historyItems).toBeGreaterThan(0);
    
    const firstHistoryItem = page.locator('[data-testid="workout-history-item"]').first();
    await expect(firstHistoryItem).toContainText('Test Workout 1');
    await expect(firstHistoryItem).toContainText('10 reps × 100 kg');
  });
});