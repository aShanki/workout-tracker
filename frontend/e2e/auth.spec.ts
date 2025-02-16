import { test, expect } from '@playwright/test';
import { signup, login } from './utils';

test.describe('Authentication', () => {
  test('should allow new user signup', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click signup link
    await page.getByRole('link', { name: 'Sign up' }).click();
    await expect(page.getByTestId('signup-form')).toBeVisible();

    // Fill signup form
    const testEmail = `test${Date.now()}@example.com`;
    await page.getByTestId('email-input').fill(testEmail);
    await page.getByTestId('password-input').fill('password123');
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Should redirect to main app after signup
    const authContent = page.locator('[data-testid="workout-list"], [data-testid="empty-workout-list"]').first();
    await expect(authContent).toBeVisible({ timeout: 10000 });
  });

  test('should allow user login', async ({ page }) => {
    await login(page);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.getByTestId('email-input').fill('wrong@example.com');
    await page.getByTestId('password-input').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByTestId('login-error')).toBeVisible();
  });

  test('should redirect to login for protected routes when not authenticated', async ({ page }) => {
    // Try to access protected route directly
    await page.goto('/workout/create');
    await page.waitForLoadState('networkidle');

    // Should be redirected to login
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('should allow access to protected routes when authenticated', async ({ page }) => {
    await login(page);

    // Try to access protected route
    await page.goto('/workout/create');
    await page.waitForLoadState('networkidle');

    // Should see protected content
    await expect(page.getByTestId('workout-form')).toBeVisible();
  });

  test('should persist authentication between page reloads', async ({ page }) => {
    await login(page);

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still be logged in
    const authContent = page.locator('[data-testid="workout-list"], [data-testid="empty-workout-list"]').first();
    await expect(authContent).toBeVisible({ timeout: 10000 });
  });
});