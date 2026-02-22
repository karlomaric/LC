import { test, expect } from '@playwright/test';

test('Registration form fields are cleared after page refresh', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navigate to the registration form
  await page.getByRole('link', { name: /Create New Account/i }).click();
  await page.waitForLoadState('networkidle');

  // Fill in only a few fields
  await page.getByLabel('First Name').fill('Karlo');
  await page.getByLabel('Email Address').fill('karlo.test@gmail.com');
  await page.getByLabel('City').fill('Split');

  await page.screenshot({ path: 'form-before-refresh.png', fullPage: true });

  // Refresh the page
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'form-after-refresh.png', fullPage: true });

  // Filled fields should be empty after refresh
  await expect(page.getByLabel('First Name')).toHaveValue('');
  await expect(page.getByLabel('Email Address')).toHaveValue('');
  await expect(page.getByLabel('City')).toHaveValue('');
});
