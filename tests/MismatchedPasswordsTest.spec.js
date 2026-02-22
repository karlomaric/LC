import { test, expect } from '@playwright/test';

function generateEmail() {
  const timestamp = Date.now();
  return `test${timestamp}@gmail.com`;
}

// BUG: The app allows registration when Password and Confirm Password fields do not match.
// This test passes — which is the bug. A successful login after mismatched password registration
// should never be possible.

test('BUG - Registration and login succeed despite mismatched passwords', async ({ page }) => {
  const email = generateEmail();
  const password = 'Summer2006';
  const differentPassword = 'Winterwinterwinterwinterwinter2026';

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navigate to registration form
  await page.getByRole('link', { name: /Create New Account/i }).click();
  await page.waitForLoadState('networkidle');

  // Fill the form with intentionally mismatched passwords
  await page.getByLabel('First Name').fill('Karlo');
  await page.getByLabel('Last Name').fill('Test');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Phone Number').fill('095123456');
  await page.getByLabel('Street Address').fill('Vukovarska ulica 100');
  await page.getByLabel('City').fill('Split');
  await page.getByLabel('ZIP Code').fill('21000');
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm Password').fill(differentPassword);

  await page.screenshot({ path: 'mismatched-passwords-form.png', fullPage: true });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole('button', { name: /Create Account/i }).click();

  // App redirects to login page despite mismatched passwords
  await page.waitForURL(/index\.html/, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'mismatched-passwords-after-register.png', fullPage: true });

  // Log in with the email and the Password field value
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: /Login/i }).click();

  await page.waitForURL(/dashboard\.html/, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'mismatched-passwords-login-result.png', fullPage: true });

  // Login succeeds — this should never happen, the registration should have been rejected
  await expect(page).toHaveURL(/dashboard\.html/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
