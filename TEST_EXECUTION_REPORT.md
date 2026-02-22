# Test Execution Report

**Project:** QA Test Web App – Automation Suite
**Application under test:** https://qa-test-web-app.vercel.app/index.html
**Framework:** Playwright v1.58.2 | JavaScript (ESM)
**Pattern:** Page Object Model (BasePage.js)
**Executed by:** Karlo Marić
**Execution date:** 2026-02-22
**Environment:** Windows 11 Pro | Node.js | Chromium (Desktop Chrome)

---

## 1. Executive Summary

A total of **14 automated end-to-end tests** were executed against the QA Test Web App.
The suite covers registration, authentication, form validation, navigation, and session management.

**11 tests passed** and **3 tests failed intentionally** — each failing test was written specifically to expose and document a known defect in the application. No production-level regressions were found. All functional flows work as expected.

---

## 2. Test Metrics

| Metric                   | Value            |
|--------------------------|------------------|
| Total tests              | 14               |
| Passed                   | 11               |
| Failed                   | 3                |
| Skipped                  | 0                |
| Flaky                    | 0                |
| Pass rate                | 78.6%            |
| Fail rate                | 21.4%            |
| Total execution time     | ~1 min 30 sec    |
| Execution date           | 2026-02-22       |
| Browser                  | Chromium         |
| Workers                  | 1 (sequential)   |
| Retries on failure       | 0                |

### Test type distribution

| Type       | Count | % of total |
|------------|-------|------------|
| Functional | 6     | 42.9%      |
| Negative   | 4     | 28.6%      |
| E2E        | 1     | 7.1%       |
| Bug        | 3     | 21.4%      |

### Result by test type

| Type       | Passed | Failed |
|------------|--------|--------|
| Functional | 6      | 0      |
| Negative   | 4      | 0      |
| E2E        | 1      | 0      |
| Bug        | 1*     | 3      |

> *TC-007 (MismatchedPasswordsTest) is counted as passed because it asserts that the buggy behavior actively occurs — confirming the bug. The 3 failed bug tests are intentionally designed to fail to signal the defect.

---

## 3. Test Execution Results

| #  | Test ID | Test Name                                           | Type       | Result | Order |
|----|---------|-----------------------------------------------------|------------|--------|-------|
| 1  | TC-011  | Registration form fields cleared after page refresh | Functional | ✅ PASS | 1/14 |
| 2  | TC-006  | Cannot create account with existing email           | Negative   | ✅ PASS | 2/14 |
| 3  | TC-005  | Register and login with new account                 | E2E        | ✅ PASS | 3/14 |
| 4  | TC-003  | User can log out after logging in                   | Functional | ✅ PASS | 4/14 |
| 5  | TC-004  | User is redirected to the Dashboard after login     | Functional | ✅ PASS | 5/14 |
| 6  | TC-002  | Login with existing account                         | Functional | ✅ PASS | 6/14 |
| 7  | TC-010  | Login with invalid password shows error             | Negative   | ✅ PASS | 7/14 |
| 8  | TC-007  | [BUG] Mismatched passwords accepted at registration | Bug        | ✅ PASS | 8/14 |
| 9  | TC-012  | [BUG] Redirected to Login page after registration   | Bug        | ❌ FAIL | 9/14 |
| 10 | TC-009  | Register with invalid email (no @ symbol)           | Negative   | ✅ PASS | 10/14|
| 11 | TC-001  | Register a new account                              | Functional | ✅ PASS | 11/14|
| 12 | TC-013  | [BUG] Required fields not marked with asterisk      | Bug        | ❌ FAIL | 12/14|
| 13 | TC-008  | Submit empty fields shows validation warnings       | Negative   | ✅ PASS | 13/14|
| 14 | TC-014  | [BUG] App accepts 4-character weak password         | Bug        | ❌ FAIL | 14/14|

---

## 4. Detailed Results for Failing Tests

### TC-012 – [BUG] User is redirected to Login page after registration

**File:** `tests/RedirectingAfterRegistrationTest.spec.js`
**Status:** FAIL
**Failure type:** Intentional – documents a confirmed bug

**Expected behavior:**
After a successful registration, the user should be automatically logged in and redirected to the **Dashboard** (`/dashboard.html`).

**Actual behavior:**
The app redirects the user back to the **Login page** (`/index.html?registered=true`).

**Failing assertion:**
```
Error: expect(page).not.toHaveURL(expected) failed

Expected pattern: not /index\.html/
Received string: "https://qa-test-web-app.vercel.app/index.html?registered=true"
```

**Location:** `tests/RedirectingAfterRegistrationTest.spec.js:42`
**Screenshot evidence:** `bug-redirected-to-login.png`

---

### TC-013 – [BUG] Required fields are not marked with an asterisk

**File:** `tests/RequiredFieldsAsteriskTest.spec.js`
**Status:** FAIL
**Failure type:** Intentional – documents a confirmed bug

**Expected behavior:**
All required fields on the registration form (First Name, Last Name, Email Address, Phone Number, Street Address, City, ZIP Code, Password, Confirm Password) should display an asterisk (`*`) next to their label to indicate they are mandatory.

**Actual behavior:**
None of the field labels contain an asterisk. The first checked label `"First Name"` is returned as-is with no `*` character.

**Failing assertion:**
```
Error: Expected "First Name" label to contain an asterisk (*)

Expected substring: "*"
Received string:    "First Name"
```

**Location:** `tests/RequiredFieldsAsteriskTest.spec.js:32`
**Screenshot evidence:** `required-fields-asterisk.png`

---

### TC-014 – [BUG] App accepts a password with only 4 characters

**File:** `tests/WeakPasswordTest.spec.js`
**Status:** FAIL
**Failure type:** Intentional – documents a confirmed bug

**Expected behavior:**
The application should reject passwords shorter than 8 characters and display a validation message such as "Password must be at least 8 characters".

**Actual behavior:**
The app accepts a 4-character password (`abcd`) and proceeds to register the account successfully, redirecting the user to the login page with `?registered=true`.

**Failing assertion:**
```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/password must be at least 8/i')
         .or(locator('text=/password too short/i'))
         .or(locator('text=/minimum.*8.*characters/i'))
Expected: visible
Timeout: 5000ms
Error: element(s) not found
```

**Location:** `tests/WeakPasswordTest.spec.js:44`
**Screenshot evidence:** `weak-password-form.png`, `weak-password-result.png`

---

## 5. Bug Summary

| Bug ID  | Severity | Title                                                    | Test      | Status |
|---------|----------|----------------------------------------------------------|-----------|--------|
| BUG-001 | Medium   | Wrong redirect after registration (Login instead of Dashboard) | TC-012 | Open |
| BUG-002 | High     | Mismatched passwords are accepted during registration    | TC-007    | Open   |
| BUG-003 | Low      | Required fields have no asterisk (*) visual indicator    | TC-013    | Open   |
| BUG-004 | High     | Weak 4-character password accepted without validation    | TC-014    | Open   |

### Severity explanation

- **BUG-001 (Medium):** Post-registration UX is broken — user must manually log in after registering. Functional but causes friction.
- **BUG-002 (High):** Security concern — users can register with a mismatched Confirm Password. The app silently uses the `Password` field value and creates the account. No error is shown.
- **BUG-003 (Low):** UX/accessibility issue — users have no visual hint of required fields before attempting to submit.
- **BUG-004 (High):** Security concern — passwords as short as 4 characters are accepted. Minimum password length should be enforced server-side and client-side.

---

## 6. Test Coverage

### Covered user flows

| Flow                                  | Covered |
|---------------------------------------|---------|
| New user registration (happy path)    | ✅      |
| Registration with invalid email       | ✅      |
| Registration with duplicate email     | ✅      |
| Registration with mismatched passwords| ✅      |
| Registration with weak password       | ✅      |
| Registration with empty fields        | ✅      |
| Login (happy path)                    | ✅      |
| Login with wrong password             | ✅      |
| Login → Dashboard redirect            | ✅      |
| Register → Login flow (E2E)           | ✅      |
| Logout                                | ✅      |
| Form data persistence on refresh      | ✅      |
| Post-registration redirect behavior   | ✅      |
| Required field visual indicators      | ✅      |

### Not covered (out of scope / not present in app)

| Area                              | Reason                      |
|-----------------------------------|-----------------------------|
| Password reset / forgot password  | Feature not present in app  |
| Email verification                | Feature not present in app  |
| Profile editing                   | Feature not present in app  |
| Cross-browser (Firefox, WebKit)   | Run on Chromium only        |
| Mobile viewports                  | Out of scope for this sprint|
| API-level tests                   | Out of scope                |

---

## 7. Sprint Tasks

The following automation tasks were completed as part of this sprint:

| # | Task                                             | Status      |
|---|--------------------------------------------------|-------------|
| 1 | Set up Playwright project with POM structure     | ✅ Done     |
| 2 | Implement BasePage with shared helper methods    | ✅ Done     |
| 3 | Implement test data management (credentials.js)  | ✅ Done     |
| 4 | Write registration happy path test (TC-001)      | ✅ Done     |
| 5 | Write login happy path test (TC-002)             | ✅ Done     |
| 6 | Write login → logout flow test (TC-003)          | ✅ Done     |
| 7 | Write Dashboard redirect test (TC-004)           | ✅ Done     |
| 8 | Write register → login E2E test (TC-005)         | ✅ Done     |
| 9 | Write duplicate email negative test (TC-006)     | ✅ Done     |
| 10| Write mismatched passwords bug test (TC-007)     | ✅ Done     |
| 11| Write empty fields validation test (TC-008)      | ✅ Done     |
| 12| Write invalid email negative test (TC-009)       | ✅ Done     |
| 13| Write wrong password negative test (TC-010)      | ✅ Done     |
| 14| Write page refresh data cleared test (TC-011)    | ✅ Done     |
| 15| Write post-registration redirect bug test (TC-012)| ✅ Done    |
| 16| Write required fields asterisk bug test (TC-013) | ✅ Done     |
| 17| Write weak password bug test (TC-014)            | ✅ Done     |
| 18| Capture screenshots at key test steps            | ✅ Done     |
| 19| Run full test suite and validate results         | ✅ Done     |
| 20| Write README with setup instructions             | ✅ Done     |
| 21| Write test execution report with metrics         | ✅ Done     |

---

## 8. Screenshots Evidence

All screenshots are saved in the project root directory and correspond to key steps in each test.

| Screenshot                            | Test      | Description                                       |
|---------------------------------------|-----------|---------------------------------------------------|
| `create-account.png`                  | TC-001    | Registration form (empty state)                   |
| `form-filled.png`                     | TC-001    | Registration form with valid data                 |
| `registration-success.png`            | TC-001    | "Registration successful" message displayed       |
| `first-registration.png`              | TC-006    | First registration in duplicate email test        |
| `duplicate-email-error.png`           | TC-006    | "Already exists" error on second registration     |
| `login-filled.png`                    | TC-002    | Login form with credentials entered               |
| `after-login.png`                     | TC-002    | Dashboard after successful login                  |
| `login-redirect-before.png`           | TC-004    | Login page before submitting credentials          |
| `login-redirect-after.png`            | TC-004    | Dashboard after redirect from login               |
| `logout-before.png`                   | TC-003    | Dashboard with Logout button visible              |
| `logout-after.png`                    | TC-003    | Login page after logout                           |
| `empty-fields-before-submit.png`      | TC-008    | Registration form with only First Name + Email    |
| `empty-fields-after-submit.png`       | TC-008    | Browser validation triggered on empty fields      |
| `invalid-email-create-account.png`    | TC-009    | Registration form (empty)                         |
| `invalid-email-form-filled.png`       | TC-009    | Form with invalid email (no @)                    |
| `invalid-email-submitted.png`         | TC-009    | "Invalid email address" error shown               |
| `invalid-password-filled.png`         | TC-010    | Login with valid email, wrong password            |
| `invalid-password-result.png`         | TC-010    | "Invalid email or password" error banner          |
| `mismatched-passwords-form.png`       | TC-007    | Registration with different password values       |
| `mismatched-passwords-after-register.png` | TC-007| App redirects to login (no error shown)           |
| `mismatched-passwords-login-result.png`   | TC-007| Successful login despite mismatched passwords     |
| `form-before-refresh.png`             | TC-011    | Form partially filled before refresh              |
| `form-after-refresh.png`              | TC-011    | Form cleared after page reload                    |
| `required-fields-asterisk.png`        | TC-013    | Registration form — no asterisks on labels (BUG)  |
| `weak-password-form.png`              | TC-014    | Form with 4-char password submitted               |
| `weak-password-result.png`            | TC-014    | No validation error shown (BUG)                   |
| `bug-redirected-to-login.png`         | TC-012    | After registration — redirected to Login page (BUG)|

---

## 9. Recommendations

1. **Fix BUG-002 (High):** Add server-side and client-side validation to ensure `Password === Confirm Password` before account creation. This is a data integrity issue.
2. **Fix BUG-004 (High):** Enforce a minimum password length of at least 8 characters with a clear validation error message shown to the user.
3. **Fix BUG-001 (Medium):** After successful registration, automatically log the user in and redirect to the Dashboard. This improves onboarding UX.
4. **Fix BUG-003 (Low):** Add asterisk (`*`) markers to all required field labels on the registration form for standard UX clarity.
5. **Extend test coverage** to Firefox and WebKit browsers to ensure cross-browser compatibility.
6. **Add test.describe grouping** in the test files to better organize tests by feature (Registration, Login, Validation, etc.).
