import { test, expect } from '@playwright/test';

function generateEmail() {
  const timestamp = Date.now();
  return `test${timestamp}@gmail.com`;
}

test('Register and login with new account', async ({ page }) => {
  const email = generateEmail();
  const password = 'abcd';

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Click on Create New Account button
  await page.getByRole('link', { name: /Create New Account/i }).click();
  await page.waitForLoadState('networkidle');

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

  // Click Create Account button
  await page.getByRole('button', { name: /Create Account/i }).click();
  await page.waitForTimeout(2000);

  // User is redirected to Login page (known bug - should go to Homepage)
  // Now log in with the registered credentials
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.screenshot({ path: 'login-filled.png', fullPage: true });

  // Click Login button
  await page.getByRole('button', { name: /Login/i }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'after-login.png', fullPage: true });
});
