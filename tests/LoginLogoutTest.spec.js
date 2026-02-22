import { test, expect } from '@playwright/test';
import { credentials } from '../test-data/credentials.js';
import fs from 'fs';
import path from 'path';

function generateEmail() {
  const timestamp = Date.now();
  return `test${timestamp}@gmail.com`;
}

async function registerFreshAccount(page) {
  const email = generateEmail();
  const password = 'abcd';

  const credentialsPath = path.resolve('./test-data/credentials.js');
  const content = `export const credentials = {\n  user: {\n    email: '${email}',\n    password: '${password}'\n  }\n};\n`;
  fs.writeFileSync(credentialsPath, content);

  await page.getByRole('link', { name: /Create New Account/i }).click();
  await page.waitForLoadState('networkidle');

  await page.getByLabel('First Name').fill('Karlo');
  await page.getByLabel('Last Name').fill('Test');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Phone Number').fill('095123456');
  await page.getByLabel('Street Address').fill('Vukovarska ulica 100');
  await page.getByLabel('City').fill('Split');
  await page.getByLabel('ZIP Code').fill('21000');
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm Password').fill(password);

  await page.getByRole('button', { name: /Create Account/i }).click();

  await page.waitForURL(/index\.html/, { timeout: 10000 });
  await page.waitForLoadState('networkidle');

  return { email, password };
}

test('User can log out after logging in', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Try logging in with existing credentials first
  await page.getByLabel('Email Address').fill(credentials.user.email);
  await page.getByLabel('Password').fill(credentials.user.password);
  await page.getByRole('button', { name: /Login/i }).click();
  await page.waitForTimeout(2000);

  // If login failed, register a fresh account and try again
  const loginFailed = await page.locator('text=Invalid email or password').isVisible();
  if (loginFailed) {
    const { email, password } = await registerFreshAccount(page);

    await page.getByLabel('Email Address').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: /Login/i }).click();
  }

  // Wait until we're on the dashboard
  await page.waitForURL(/dashboard\.html/, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'logout-before.png', fullPage: true });

  // Click the Logout button
  await page.getByRole('button', { name: /Logout/i }).click();

  // Should be redirected back to the login page
  await page.waitForURL(/index\.html/, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'logout-after.png', fullPage: true });

  // Login page should be visible again
  await expect(page).toHaveURL(/index\.html/);
  await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Login$/i })).toBeVisible();

  // Dashboard should no longer be accessible
  await expect(page.getByRole('button', { name: /Logout/i })).not.toBeVisible();
});
