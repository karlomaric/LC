# LC – Playwright Test Automation Suite

End-to-end test automation for the QA Test Web App
**Target application:** https://qa-test-web-app.vercel.app/index.html

---

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Overview](#test-overview)
- [Known Bugs Documented](#known-bugs-documented)
- [Test Data](#test-data)
- [Screenshots](#screenshots)

---

## Project Structure

```
LC/
├── pages/
│   └── BasePage.js                        # Base Page Object (shared helpers)
├── test-data/
│   └── credentials.js                     # Shared login credentials (auto-updated by RegisterTest)
├── tests/
│   ├── RegisterTest.spec.js               # TC-001: New user registration
│   ├── LoginTest.spec.js                  # TC-002: Login with valid credentials
│   ├── LoginLogoutTest.spec.js            # TC-003: Login and logout flow
│   ├── LoginRedirectTest.spec.js          # TC-004: Redirect to Dashboard after login
│   ├── LoginAfterRegistrationTest.spec.js # TC-005: Register then immediately log in
│   ├── DuplicateEmailTest.spec.js         # TC-006: Duplicate email rejected
│   ├── MismatchedPasswordsTest.spec.js    # TC-007: [BUG] Mismatched passwords accepted
│   ├── SubmitEmptyFieldsTest.spec.js      # TC-008: Empty fields show validation warnings
│   ├── RegisterInvalidEmailTest.spec.js   # TC-009: Invalid email rejected on registration
│   ├── LoginWithInvalidPasswordTest.spec.js # TC-010: Wrong password shows error
│   ├── DataClearedOnRefreshTest.spec.js   # TC-011: Form cleared on page refresh
│   ├── RedirectingAfterRegistrationTest.spec.js # TC-012: [BUG] Wrong redirect after registration
│   ├── RequiredFieldsAsteriskTest.spec.js # TC-013: [BUG] Required fields missing asterisk
│   └── WeakPasswordTest.spec.js           # TC-014: [BUG] Weak password accepted
├── playwright-report/
│   └── index.html                         # HTML test report (generated after run)
├── test-results/
│   └── .last-run.json                     # Last run status
├── playwright.config.js                   # Playwright configuration
├── package.json
└── README.md
```

---

## Prerequisites

| Tool       | Version  | Download |
|------------|----------|----------|
| Node.js    | >= 18.x  | https://nodejs.org |
| npm        | >= 9.x   | Included with Node.js |

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd LC
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

---

## Running Tests

### Run all tests (headless, all browsers)

```bash
npm test
```

### Run all tests with browser visible

```bash
npm run test:headed
```

### Run tests in debug mode

```bash
npm run test:debug
```

### Run a single test file

```bash
npx playwright test tests/LoginTest.spec.js
```

### Run tests in a specific browser only

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Open the HTML report after a run

```bash
npm run report
```

---

## Test Overview

| ID     | Test File                            | Description                                             | Type     | Expected Result      |
|--------|--------------------------------------|---------------------------------------------------------|----------|----------------------|
| TC-001 | RegisterTest                         | New user can register with valid data                  | Functional | Pass               |
| TC-002 | LoginTest                            | Existing user can log in with valid credentials        | Functional | Pass               |
| TC-003 | LoginLogoutTest                      | User can log in and then log out                       | Functional | Pass               |
| TC-004 | LoginRedirectTest                    | User is redirected to Dashboard after login            | Functional | Pass               |
| TC-005 | LoginAfterRegistrationTest           | User can log in immediately after registering          | E2E      | Pass                 |
| TC-006 | DuplicateEmailTest                   | Registering with an already used email is rejected     | Negative | Pass                 |
| TC-007 | MismatchedPasswordsTest              | [BUG] App accepts mismatched Password / Confirm Password | Bug    | Pass (bug confirmed) |
| TC-008 | SubmitEmptyFieldsTest                | Empty required fields trigger browser validation       | Negative | Pass                 |
| TC-009 | RegisterInvalidEmailTest             | Email without @ symbol is rejected                     | Negative | Pass                 |
| TC-010 | LoginWithInvalidPasswordTest         | Wrong password shows error and blocks access           | Negative | Pass                 |
| TC-011 | DataClearedOnRefreshTest             | Form data is not persisted after page refresh          | Functional | Pass               |
| TC-012 | RedirectingAfterRegistrationTest     | [BUG] User redirected to Login instead of Homepage     | Bug      | Fail (bug)           |
| TC-013 | RequiredFieldsAsteriskTest           | [BUG] Required fields have no asterisk (*) marker     | Bug      | Fail (bug)           |
| TC-014 | WeakPasswordTest                     | [BUG] 4-character password should be rejected          | Bug      | Fail (bug)           |

Tests marked **[BUG]** expose known defects in the application.
TC-012, TC-013, TC-014 are **intentionally failing** to document bugs.
TC-007 **passes** because it asserts the buggy behavior actually occurs.

---

## Known Bugs Documented

### BUG-001 – Wrong redirect after registration (TC-012)
After a successful registration, the user is redirected back to the **Login page** (`/index.html`) instead of being automatically logged in and sent to the **Homepage/Dashboard**.

### BUG-002 – Mismatched passwords accepted (TC-007)
The registration form allows submission even when the **Password** and **Confirm Password** fields contain different values. The account is created using the value from the `Password` field, and the user can log in with it. No validation error is shown.

### BUG-003 – Required fields not marked with asterisk (TC-013)
None of the required fields on the registration form display an asterisk (`*`) next to their label. Users have no visual indication of which fields are mandatory before they attempt to submit.

### BUG-004 – Weak password accepted (TC-014)
The application accepts passwords as short as 4 characters (e.g. `abcd`). Industry-standard minimum is 8 characters. No validation error is displayed for short passwords.

---

## Test Data

Credentials are stored in `test-data/credentials.js`.
The `RegisterTest` automatically writes a freshly generated email and password to this file after each successful registration, so dependent tests always have a valid account.

```js
// test-data/credentials.js (auto-managed)
export const credentials = {
  user: {
    email: 'test1771604059746@gmail.com',
    password: 'abcd'
  }
};
```

> **Note:** Do not edit this file manually — it is overwritten on each registration test run.

---

## Screenshots

Each test captures screenshots at key steps. All screenshots are saved to the project root directory.

| Screenshot file                     | Description                                        |
|-------------------------------------|----------------------------------------------------|
| `create-account.png`                | Registration form (empty)                         |
| `form-filled.png`                   | Registration form with valid data filled in       |
| `registration-success.png`          | Success message after registration                |
| `first-registration.png`            | First registration in duplicate-email test        |
| `after-login.png`                   | Dashboard after successful login                  |
| `login-filled.png`                  | Login form with credentials filled in             |
| `login-redirect-before/after.png`   | Before/after redirect to Dashboard                |
| `logout-before/after.png`           | Dashboard before logout / Login page after        |
| `duplicate-email-error.png`         | Error when registering with existing email        |
| `empty-fields-before/after.png`     | Form before/after submitting empty fields         |
| `invalid-email-*.png`               | Invalid email registration flow                   |
| `invalid-password-*.png`            | Wrong password login attempt                      |
| `mismatched-passwords-*.png`        | Mismatched password registration + login          |
| `form-before/after-refresh.png`     | Form state before/after page refresh              |
| `required-fields-asterisk.png`      | Registration form (no asterisks on labels)        |
| `weak-password-*.png`               | Weak password form and result                     |
| `bug-redirected-to-login.png`       | Bug: redirected to Login after registration       |

---

## Configuration

Defined in `playwright.config.js`:

| Setting         | Value                                           |
|-----------------|-------------------------------------------------|
| Base URL        | https://qa-test-web-app.vercel.app/index.html   |
| Browsers        | Chromium, Firefox, WebKit                       |
| Workers         | 1 (sequential)                                  |
| Retries (CI)    | 2                                               |
| Reporter        | HTML                                            |
| Headless        | false (headed by default)                       |
| Trace           | on-first-retry                                  |

---

## Author

Karlo Marić
