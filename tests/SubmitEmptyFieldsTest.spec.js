import { test, expect } from '@playwright/test';

test('Submitting registration form with empty fields shows warnings', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navigate to the registration form
  await page.getByRole('link', { name: /Create New Account/i }).click();
  await page.waitForLoadState('networkidle');

  // Fill only First Name and Email, leave the rest empty
  await page.getByLabel('First Name').fill('Karlo');
  await page.getByLabel('Email Address').fill('karlo.test@gmail.com');

  await page.screenshot({ path: 'empty-fields-before-submit.png', fullPage: true });

  // Try to submit the form
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole('button', { name: /Create Account/i }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'empty-fields-after-submit.png', fullPage: true });

  // Empty required fields should be flagged as invalid by the browser
  const emptyRequiredFields = [
    page.getByLabel('Last Name'),
    page.getByLabel('Phone Number'),
    page.getByLabel('Street Address'),
    page.getByLabel('City'),
    page.getByLabel('ZIP Code'),
    page.getByLabel('Password', { exact: true }),
    page.getByLabel('Confirm Password'),
  ];

  for (const field of emptyRequiredFields) {
    // valueMissing is true when a required field is empty
    const valueMissing = await field.evaluate(el => el.validity.valueMissing);
    expect(valueMissing).toBe(true);

    // The browser validation message should say the field needs to be filled
    const validationMessage = await field.evaluate(el => el.validationMessage);
    expect(validationMessage.length).toBeGreaterThan(0);
  }

  // The form should not have been submitted — still on the registration page
  await expect(page.getByRole('heading', { name: /Create Account/i })).toBeVisible();
  await expect(page).not.toHaveURL(/dashboard\.html/);
});
