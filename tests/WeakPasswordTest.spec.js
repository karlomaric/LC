import { test, expect } from '@playwright/test';

function generateEmail() {
  const timestamp = Date.now();
  return `test${timestamp}@gmail.com`;
}

// BUG: The app accepts passwords as short as 4 characters.
// Passwords should be required to be at least 8 characters long for basic security.
// A 4-character password like 'abcd' should be rejected with a validation error.

test('BUG - App accepts a password with only 4 characters', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.getByRole('link', { name: /Create New Account/i }).click();
  await page.waitForLoadState('networkidle');

  // Fill the form with a 4-character password
  await page.getByLabel('First Name').fill('Karlo');
  await page.getByLabel('Last Name').fill('Test');
  await page.getByLabel('Email Address').fill(generateEmail());
  await page.getByLabel('Phone Number').fill('095123456');
  await page.getByLabel('Street Address').fill('Vukovarska ulica 100');
  await page.getByLabel('City').fill('Split');
  await page.getByLabel('ZIP Code').fill('21000');
  await page.getByLabel('Password', { exact: true }).fill('abcd'); // only 4 characters
  await page.getByLabel('Confirm Password').fill('abcd');

  await page.screenshot({ path: 'weak-password-form.png', fullPage: true });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole('button', { name: /Create Account/i }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'weak-password-result.png', fullPage: true });

  // The app SHOULD reject a 4-character password and show a validation error.
  // Instead it accepts it — this assertion documents the bug.
  await expect(
    page.locator('text=/password must be at least 8/i')
      .or(page.locator('text=/password too short/i'))
      .or(page.locator('text=/minimum.*8.*characters/i'))
  ).toBeVisible();
});
