import { test, expect } from '@playwright/test';
import { login, seedTestData } from './utils';

test.describe('Progress Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await seedTestData(page);
  });

  test('exercise progress history', async ({ page }) => {
    await page.getByTestId('exercise-progress-button').click();
    await page.waitForURL('**/progress');

    await page.getByTestId('exercise-select').click();
    await page.getByRole('option', { name: 'Bench Press' }).click();

    await expect(page.getByTestId('exercise-progress-chart')).toBeVisible();
    await expect(page.getByTestId('exercise-progress-list')).toBeVisible();
    await expect(page.getByTestId('exercise-progress-list')).toContainText('100 kg');
  });

  test('workout reports', async ({ page }) => {
    await page.getByTestId('workout-reports-button').click();
    await page.waitForURL('**/reports');

    await expect(page.getByTestId('workout-frequency-chart')).toBeVisible();
    await expect(page.getByTestId('workout-volume-chart')).toBeVisible();
    await expect(page.getByTestId('workout-stats')).toContainText('Total Workouts');
  });

  test('upcoming workouts', async ({ page }) => {
    await page.getByTestId('workout-calendar-button').click();
    await page.waitForURL('**/calendar');

    await expect(page.getByTestId('workout-calendar')).toBeVisible();
    await expect(page.getByTestId('upcoming-workouts')).toBeVisible();
    await expect(page.locator('[data-testid="upcoming-workout-card"]').first()).toContainText('Test Workout 1');
  });

  test('date range filtering', async ({ page }) => {
    await page.getByTestId('exercise-progress-button').click();
    await page.getByTestId('exercise-select').click();
    await page.getByRole('option', { name: 'Bench Press' }).click();

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    await page.getByTestId('date-range-start').fill(startDate.toISOString().split('T')[0]);
    await page.getByTestId('date-range-end').fill(new Date().toISOString().split('T')[0]);
    await page.getByTestId('apply-date-filter').click();

    await expect(page.getByTestId('exercise-progress-chart')).toBeVisible();
    await expect(page.getByTestId('exercise-progress-list')).toBeVisible();
  });

  test('personal records', async ({ page }) => {
    await page.getByTestId('exercise-progress-button').click();
    await page.getByTestId('personal-records-tab').click();

    await expect(page.getByTestId('personal-records')).toBeVisible();
    const benchPressPR = page.locator('[data-testid="pr-card"]').filter({ hasText: 'Bench Press' });
    await expect(benchPressPR).toContainText('110 kg');
  });
});