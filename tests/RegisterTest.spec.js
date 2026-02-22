import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

function generateEmail() {
  const timestamp = Date.now();
  return `test${timestamp}@gmail.com`;
}

test('Register a new account', async ({ page }) => {
  const email = generateEmail();
  const password = 'abcd';

  // Save credentials to credentials.js so LoginTest can use them
  const credentialsPath = path.resolve('./test-data/credentials.js');
  const content = `export const credentials = {\n  user: {\n    email: '${email}',\n    password: '${password}'\n  }\n};\n`;
  fs.writeFileSync(credentialsPath, content);

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

  // Scroll down so the success message will be visible
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Click Create Account button
  await page.getByRole('button', { name: /Create Account/i }).click();

  // Verify the success message is shown before redirect
  await page.waitForTimeout(500);
  await expect(page.locator('text=/Registration successful/i')).toBeVisible();
  await page.screenshot({ path: 'registration-success.png', fullPage: true });
});
