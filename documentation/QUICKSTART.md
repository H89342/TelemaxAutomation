# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your test environment details:

```env
ENVIRONMENT=dev
BASE_URL=http://localhost:3000
```

### 3. Run Tests

Run all tests:
```bash
npm test
```

Run only web tests:
```bash
npm run test:web
```

Run only mobile tests:
```bash
npm run test:mobile
```

### 4. View Results

```bash
npm run report
```

Opens HTML report in browser.

---

## 📁 Framework Structure Overview

```
TelemaxAutomation/
├── pages/          # Page Objects (LoginPage, DashboardPage, etc.)
├── fixtures/       # Test Fixtures (setup/teardown, custom utilities)
├── utils/          # Helper Functions (testHelpers, apiHelpers, etc.)
├── data/           # Test Data (users, products, forms)
├── config/         # Configuration (environment settings)
├── tests/
│   ├── web/        # Web app tests
│   └── mobile/     # Mobile app tests
└── README.md       # Full documentation
```

---

## ✍️ Write Your First Test

### 1. Create a Page Object

`pages/MyPage.js`:
```javascript
import { BasePage } from './BasePage.js';

export class MyPage extends BasePage {
  async clickMyButton() {
    await this.click('button[id="myButton"]');
  }
  
  async getMyText() {
    return await this.getText('.my-class');
  }
}
```

### 2. Write a Test

`tests/web/mytest.spec.js`:
```javascript
import { test, expect } from '../fixtures/testFixtures.js';
import { MyPage } from '../pages/MyPage.js';

test.describe('My Tests', () => {
  test('should do something', async ({ page, basePage }) => {
    const myPage = new MyPage(page);
    
    await myPage.goto('/mypage');
    await myPage.clickMyButton();
    
    const text = await myPage.getMyText();
    expect(text).toBe('Expected Text');
  });
});
```

### 3. Run Your Test

```bash
npx playwright test tests/web/mytest.spec.js
```

---

## 🔑 Key Features

### 📖 Page Objects

Reusable page components for maintainable tests:

```javascript
class LoginPage extends BasePage {
  emailInput = 'input[name="email"]';
  
  async login(email, password) {
    await this.fillText(this.emailInput, email);
    // ... more actions
  }
}
```

### 🧪 Test Fixtures

Pre-configured test setup via fixtures:

```javascript
test('should do something', async ({ 
  page,              // Playwright Page
  basePage,          // Base page utilities  
  authenticatedPage, // Pre-logged in page
  apiContext        // API testing
}) => {
  // Test code
});
```

### 📊 Test Data

Centralized test data for reusability:

```javascript
import { testUsers, formData } from '../data/testData.js';

// Use in tests
await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
```

### 🛠️ Utilities

Helper functions for common operations:

```javascript
import { generateRandomEmail, wait, retry } from '../utils/testHelpers.js';
import { isValidEmail, isValidPhoneNumber } from '../utils/validationHelpers.js';
import { parseJsonResponse, createAuthHeader } from '../utils/apiHelpers.js';
```

---

## 🏃 Running Tests

### By Type
```bash
npm run test:web      # Web tests only
npm run test:mobile   # All mobile tests (iOS & Android)
```

### By Mobile Platform
```bash
npm run test:ios      # All iOS tests
npm run test:android  # All Android tests
```

### By Specific Mobile Device
```bash
npm run test:iphone       # iPhone 12 only
npm run test:iphone-se    # iPhone SE only
npm run test:pixel        # Pixel 5 only
```

### Debug Modes
```bash
npm run test:debug    # Step through with debugger
npm run test:headed   # See browser while running
npm run test:ui       # Interactive UI mode
```

---

## 💡 Tips & Tricks

### 1. Use Page Objects
Centralizes selectors and actions. When UI changes, update only in one place.

### 2. Tag Your Tests
```javascript
test('@smoke should login', ...)
test('@regression should logout', ...)
```

Run specific tags: `npx playwright test --grep @smoke`

### 3. Follow AAA Pattern
```javascript
// Arrange - prepare
const data = prepareData();

// Act - perform action
await performAction(data);

// Assert - verify result
expect(result).toBe(expected);
```

### 4. Use Test Timeouts
```javascript
test('should load', async ({ page }) => {
  await page.waitForSelector('.loaded', { timeout: 10000 });
}, { timeout: 15000 });
```

### 5. Take Screenshots on Failure
Automatically done! Check `test-results/` folder.

### 6. Use Environment Variables
```bash
# .env file
BASE_URL=http://localhost:3000
ENVIRONMENT=dev
```

Access in tests:
```javascript
process.env.BASE_URL
process.env.ENVIRONMENT
```

### 7. API Testing
```javascript
test('api test', async ({ apiContext }) => {
  const response = await apiContext.get('/api/users');
  expect(response.status).toBe(200);
});
```

### 8. Mobile-Specific Testing
```javascript
test('mobile test', async ({ page, mobileContext }) => {
  // Mobile-specific actions
  await mobileContext.tap(page, '#button');
});
```

---

## � Debugging

### 1. Debug Mode
```bash
npm run test:debug
```

### 2. Headed Mode (see browser)
```bash
npm run test:headed
```

### 3. UI Mode (interactive)
```bash
npm run test:ui
```

### 4. Check Traces
```bash
npx playwright show-trace path/to/trace.zip
```

### 5. Console Logs
```javascript
test('debug', async ({ page }) => {
  console.log('URL:', page.url());
  console.log('Variables:', { var1, var2 });
});
```

## 📱 Mobile Testing

### Platform-Specific Tests
```bash
# iOS only
npm run test:ios

# Android only
npm run test:android

# Specific device
npm run test:iphone        # iPhone 12
npm run test:iphone-se     # iPhone SE
npm run test:pixel         # Pixel 5
```

### Platform-Aware Page Objects
```javascript
import { MobileBasePage } from '../pages/MobileBasePage.js';

export class MyPage extends MobileBasePage {
  get selector() {
    // Automatically returns platform-specific selector
    return this.getPlatformSelector(
      'ios-selector',      // Used on iOS
      'android-selector'   // Used on Android
    );
  }

  async platformAction() {
    // Execute platform-specific code
    await this.performPlatformAction(
      () => this.tap('ios-button'),     // iOS
      () => this.page.keyboard.press('Enter') // Android
    );
  }
}
```

See [MOBILE_TESTING_GUIDE.md](./MOBILE_TESTING_GUIDE.md) for complete mobile testing documentation.

---

## 📚 Common Patterns

### Login Test
```javascript
test('should login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto('/login');
  await login.login('user@test.com', 'password');
  await page.waitForURL('**/dashboard');
});
```

### Form Test
```javascript
test('should submit form', async ({ page }) => {
  const form = new FormPage(page);
  await form.goto('/contact');
  await form.fillForm({ name: 'John', email: 'john@test.com' });
  await form.submitForm();
});
```

### API Test
```javascript
test('should fetch user', async ({ apiContext }) => {
  const response = await apiContext.get('/api/user/profile');
  expect(response.status).toBe(200);
  expect(response.data.email).toBeDefined();
});
```

### Mobile Test
```javascript
test('should work on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  expect(await page.isVisible('button')).toBeTruthy();
});
```

---

## 📞 Next Steps

1. ✅ Run `npm install` - Install dependencies
2. ✅ Copy `.env.example` to `.env` - Configure environment
3. ✅ Run `npm test` - Execute tests
4. ✅ Run `npm run report` - View results
5. ✅ Create your first page object
6. ✅ Write your first test
7. ✅ Check README.md for detailed documentation

---

**You're ready to automate!** 🚀

See [README.md](./README.md) for complete documentation.
