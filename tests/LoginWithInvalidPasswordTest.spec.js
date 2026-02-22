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

  // App redirects back to the login page after registration (known bug)
  await page.waitForURL(/index\.html/, { timeout: 10000 });
  await page.waitForLoadState('networkidle');

  return { email, password };
}

test('Login with invalid password shows error', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1920, height: 1080 });

  // First ensure a valid account exists
  await page.getByLabel('Email Address').fill(credentials.user.email);
  await page.getByLabel('Password').fill(credentials.user.password);
  await page.getByRole('button', { name: /Login/i }).click();
  await page.waitForTimeout(2000);

  let validEmail = credentials.user.email;

  const loginFailed = await page.locator('text=Invalid email or password').isVisible();
  if (loginFailed) {
    // Account is gone — register a fresh one (lands back on login page)
    ({ email: validEmail } = await registerFreshAccount(page));
  } else {
    // Login succeeded — go back to the login page to run the actual test
    await page.waitForURL(/dashboard\.html/, { timeout: 10000 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  }

  // Now try to log in with the valid email but a wrong password
  await page.getByLabel('Email Address').fill(validEmail);
  await page.getByLabel('Password').fill('wrongpassword123');
  await page.screenshot({ path: 'invalid-password-filled.png', fullPage: true });

  await page.getByRole('button', { name: /Login/i }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'invalid-password-result.png', fullPage: true });

  // Error warning banner should be visible with danger styling (red background, dark red text)
  const warning = page.locator('text=Invalid email or password');
  await expect(warning).toBeVisible();

  const bgColor = await warning.evaluate(el => window.getComputedStyle(el).backgroundColor);
  const color   = await warning.evaluate(el => window.getComputedStyle(el).color);

  // Background should be reddish-pink (high R, lower G and B)
  const [bgR, bgG, bgB] = bgColor.match(/\d+/g).map(Number);
  expect(bgR).toBeGreaterThan(bgG);
  expect(bgR).toBeGreaterThan(bgB);

  // Text should be dark red (high R relative to G and B)
  const [fgR, fgG, fgB] = color.match(/\d+/g).map(Number);
  expect(fgR).toBeGreaterThan(fgG);
  expect(fgR).toBeGreaterThan(fgB);

  // Should remain on the login page — no redirect to dashboard
  await expect(page).not.toHaveURL(/dashboard\.html/);
  await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Login$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Logout/i })).not.toBeVisible();
});
