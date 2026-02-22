import { test, expect } from '@playwright/test';

function generateEmail() {
  const timestamp = Date.now();
  return `test${timestamp}@gmail.com`;
}

test('BUG - User is redirected to Login page instead of Homepage after registration', async ({ page }) => {
  const email = generateEmail();
  const password = 'abcd';

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Click on Create New Account button
  await page.getByRole('link', { name: /Create New Account/i }).click();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'create-account.png', fullPage: true });

  // Fill in the registration form
  await page.getByLabel('First Name').fill('Karlo');
  await page.getByLabel('Last Name').fill('Test');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Phone Number').fill('095123456');
  await page.getByLabel('Street Address').fill('Vukovarska ulica 100');
  await page.getByLabel('City').fill('Split');
  await page.getByLabel('ZIP Code').fill('21000');
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm Password').fill(password);

  await page.screenshot({ path: 'form-filled.png', fullPage: true });

  // Click Create Account button
  await page.getByRole('button', { name: /Create Account/i }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'bug-redirected-to-login.png', fullPage: true });

  // BUG: After registration, user should be logged in and redirected to Homepage
  // Instead, user is redirected to the Login page
  // This SHOULD pass but FAILS because of the bug
  await expect(page).not.toHaveURL(/index\.html/);
  await expect(page.locator('text=/Welcome Back/i')).not.toBeVisible();
});
