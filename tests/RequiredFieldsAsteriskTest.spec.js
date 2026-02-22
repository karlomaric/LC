import { test, expect } from '@playwright/test';

// BUG: Required fields on the registration form are not marked with an asterisk (*).
// Users have no visual indication of which fields are mandatory before attempting to submit.
// All fields with the `required` attribute should display an asterisk next to their label.

test('BUG - Required fields are not marked with an asterisk', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navigate to the registration form
  await page.getByRole('link', { name: /Create New Account/i }).click();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'required-fields-asterisk.png', fullPage: true });

  // Every required field label should have an asterisk (*) next to it
  const requiredFieldLabels = [
    'First Name',
    'Last Name',
    'Email Address',
    'Phone Number',
    'Street Address',
    'City',
    'ZIP Code',
    'Password',
    'Confirm Password',
  ];

  for (const labelName of requiredFieldLabels) {
    const labelText = await page.getByText(labelName, { exact: true }).first().textContent();
    expect(labelText, `Expected "${labelName}" label to contain an asterisk (*)`).toContain('*');
  }
});
