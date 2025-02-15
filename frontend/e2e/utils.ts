import { Page, expect } from '@playwright/test';

export async function login(page: Page, email = 'test@example.com', password = 'password123') {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await expect(page.getByTestId('login-form')).toBeVisible();
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('password-input').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  // Wait for successful login
  const authContent = page.locator('[data-testid="workout-list"], [data-testid="empty-workout-list"]').first();
  await expect(authContent).toBeVisible({ timeout: 10000 });
}

export async function signup(page: Page, email: string, password: string) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.getByRole('link', { name: 'Sign up' }).click();
  await expect(page.getByTestId('signup-form')).toBeVisible();
  
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('password-input').fill(password);
  await page.getByRole('button', { name: 'Sign up' }).click();

  // Wait for successful signup and redirect
  const authContent = page.locator('[data-testid="workout-list"], [data-testid="empty-workout-list"]').first();
  await expect(authContent).toBeVisible({ timeout: 10000 });
}

export async function seedTestData(page: Page) {
  await page.addInitScript(() => {
    window.__testState = {
      exercises: [
        {
          id: '1',
          name: 'Bench Press',
          description: 'Barbell bench press',
          category: 'Chest'
        },
