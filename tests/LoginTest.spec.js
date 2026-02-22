import { test, expect } from '@playwright/test';
import { credentials } from '../test-data/credentials.js';

test('Login with existing account', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Enter credentials and login
  await page.getByLabel('Email Address').fill(credentials.user.email);
  await page.getByLabel('Password').fill(credentials.user.password);
  await page.screenshot({ path: 'login-filled.png', fullPage: true });

  // Click Login button
  await page.getByRole('button', { name: /Login/i }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'after-login.png', fullPage: true });

  // Verify successful login - user should NOT be on the login page anymore
  await expect(page).not.toHaveURL(/index\.html/);
  await expect(page.locator('text=/Welcome Back/i')).not.toBeVisible();
});
