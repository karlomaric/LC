import { test, expect } from '@playwright/test';

test('Register with invalid email (no @ symbol)', async ({ page }) => {
  const invalidEmail = 'testgmail.com'; // missing @
  const password = 'abcd';

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Click on Create New Account button
  await page.getByRole('link', { name: /Create New Account/i }).click();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'invalid-email-create-account.png', fullPage: true });

  // Fill in the registration form with an invalid email (no @)
  await page.getByLabel('First Name').fill('Karlo');
  await page.getByLabel('Last Name').fill('Test');
  await page.getByLabel('Email Address').fill(invalidEmail);
  await page.getByLabel('Phone Number').fill('095123456');
  await page.getByLabel('Street Address').fill('Vukovarska ulica 100');
  await page.getByLabel('City').fill('Split');
  await page.getByLabel('ZIP Code').fill('21000');
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm Password').fill(password);

  await page.screenshot({ path: 'invalid-email-form-filled.png', fullPage: true });

  // Scroll down so the button is visible
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Click Create Account button
  await page.getByRole('button', { name: /Create Account/i }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'invalid-email-submitted.png', fullPage: true });

  // The app shows a custom "Invalid email address" error message below the email field
  await expect(page.locator('text=Invalid email address')).toBeVisible();

  // The error message should be styled in a warning/error color (red-ish)
  const errorMessage = page.locator('text=Invalid email address');
  const errorColor = await errorMessage.evaluate(el =>
    window.getComputedStyle(el).color
  );
  // Red-ish color: high red component, low green & blue (covers common shades like #dc3545, #ef4444, #c00, etc.)
  const [r, g, b] = errorColor.match(/\d+/g).map(Number);
  expect(r).toBeGreaterThan(150);
  expect(g).toBeLessThan(100);
  expect(b).toBeLessThan(100);

  // Registration should NOT succeed — success message must NOT appear
  await expect(page.locator('text=/Registration successful/i')).not.toBeVisible();
});
