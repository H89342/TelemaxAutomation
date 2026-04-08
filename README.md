# Telemax Automation Framework

A comprehensive Playwright-based automation framework for testing both web and mobile applications.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Page Objects](#page-objects)
- [Test Data](#test-data)
- [Fixtures](#fixtures)
- [Best Practices](#best-practices)

## 📁 Project Structure

```
TelemaxAutomation/
├── pages/
│   ├── BasePage.js                    # Web page base class
│   ├── MobileBasePage.js              # Mobile base class (iOS + Android)
│   ├── LoginPage.js                   # Web login page
│   ├── DashboardPage.js               # Web dashboard page
│   ├── FormPage.js                    # Web form page
│   ├── TablePage.js                   # Web table page
│   └── mobile/
│       ├── MobileLoginPage.js         # Shared iOS/Android login page
│       ├── MobileDashboardPage.js     # Shared iOS/Android dashboard
│       └── ...
├── fixtures/                          # Custom test fixtures
│   └── testFixtures.js                # Setup/teardown and utilities
├── utils/
│   ├── testHelpers.js                 # General test helpers
│   ├── apiHelpers.js                  # API testing utilities
│   ├── validationHelpers.js           # Validation functions
│   └── mobile/
│       ├── platformDetection.js       # iOS/Android detection
│       └── platformUtils.js           # Platform-specific utilities
├── data/                              # Test data
│   └── testData.js                    # Test objects and datasets
├── config/                            # Configuration
│   └── environment.js                 # Environment settings
├── tests/
│   ├── web/                           # Web application tests
│   │   ├── login.spec.js
│   │   ├── e2e.spec.js
│   │   └── ...
│   ├── mobile/
│   │   ├── ios/                       # iOS-specific tests
│   │   │   ├── login.ios.spec.js
│   │   │   └── ...
│   │   ├── android/                   # Android-specific tests
│   │   │   ├── login.android.spec.js
│   │   │   └── ...
│   │   └── api-ui-integration.spec.js # Shared mobile tests
│   └── example.spec.js
├── playwright.config.js               # Playwright configuration
├── package.json                       # Dependencies and scripts
├── .env.example                       # Environment variables template
├── README.md                          # Main documentation
├── QUICKSTART.md                      # Quick start guide
└── MOBILE_TESTING_GUIDE.md            # Mobile testing (iOS/Android)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (16+)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your configuration:

```env
BASE_URL=http://localhost:3000
ENVIRONMENT=dev
```

4. Install Playwright browsers (optional, done automatically):

```bash
npx playwright install
```

## ⚙️ Configuration

### Environment Configuration

Edit `.env` file to set:

- `ENVIRONMENT`: dev, staging, or production
- `BASE_URL`: Application base URL
- `API_URL`: API endpoint
- Credentials for testing

### Playwright Configuration

Edit `playwright.config.js` to:

- Add/remove browser configurations
- Configure iOS and Android projects separately
- Set up web server
- Configure reporters
- Set timeouts and retries

Mobile projects are configured for:
- **iOS**: iPhone SE, iPhone 12
- **Android**: Pixel 5, Samsung Galaxy S21

Example configuration:
```javascript
projects: [
  {
    name: 'iPhone 12',
    use: { ...devices['iPhone 12'] },
    testDir: './tests/mobile',
  },
  {
    name: 'Android Chrome',
    use: { ...devices['Pixel 5'] },
    testDir: './tests/mobile',
  },
]
```

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Web Tests Only

```bash
npm run test:web
```

### Run Mobile Tests Only

```bash
npm run test:mobile
```

### Run iOS Tests Only

```bash
npm run test:ios
```

### Run Android Tests Only

```bash
npm run test:android
```

### Run Specific iOS Device

```bash
npm run test:iphone              # iPhone 12
npm run test:iphone-se           # iPhone SE
```

### Run Specific Android Device

```bash
npm run test:pixel               # Pixel 5
```

### Run Tests in Headed Mode (see browser)

```bash
npm run test:headed
```

### Run Tests in Debug Mode

```bash
npm run test:debug
```

### Run Tests with UI

```bash
npm run test:ui
```

### View HTML Report

```bash
npm run report
```

### Run Specific Test File

```bash
npx playwright test tests/web/login.spec.js
```

### Run Tests with Specific Browser

```bash
npx playwright test --project="Mobile Chrome"
```

### Run Tests with Specific Tag

```bash
npx playwright test --grep @smoke
```

## ✍️ Writing Tests

### Basic Test Structure

```javascript
import { test, expect } from '../fixtures/testFixtures.js';
import { LoginPage } from '../pages/LoginPage.js';

test.describe('Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page, basePage }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto('/login');
  });

  test('should login successfully', async ({ page }) => {
    // Arrange
    const email = 'user@example.com';
    const password = 'password123';

    // Act
    await loginPage.login(email, password);

    // Assert
    expect(page.url()).toContain('/dashboard');
  });
});
```

### Using Test Tags

```javascript
test('@smoke should verify login', async ({ page }) => {
  // test code
});

test('@regression should verify logout', async ({ page }) => {
  // test code
});
```

### Using Fixtures

```javascript
test('should login and access dashboard', async ({ authenticatedPage }) => {
  // authenticatedPage is already logged in
  const greeting = await authenticatedPage.getText('.user-greeting');
  expect(greeting).toContain('Welcome');
});
```

## 📄 Page Objects

### BasePage Class

Base class with common methods for all pages:

```javascript
import { BasePage } from '../pages/BasePage.js';

export class MyPage extends BasePage {
  async goto(url) {
    await super.goto(url);
  }

  async clickElement(selector) {
    await this.click(selector);
  }
}
```

### Available BasePage Methods

- `goto(url)` - Navigate to URL
- `click(selector)` - Click element
- `fillText(selector, text)` - Fill input field
- `getText(selector)` - Get element text
- `isVisible(selector)` - Check if element is visible
- `waitForElement(selector)` - Wait for element presence
- `getTitle()` - Get page title
- `getCurrentUrl()` - Get current URL
- `check(selector)` - Check checkbox
- `uncheck(selector)` - Uncheck checkbox
- `selectOption(selector, value)` - Select dropdown option
- `takeScreenshot(filename)` - Take screenshot
- `waitForNavigation()` - Wait for page navigation

## 📱 Mobile Page Objects (iOS & Android)

### MobileBasePage Class

Shared base class for both iOS and Android with platform-aware methods:

```javascript
import { MobileBasePage } from '../MobileBasePage.js';

export class MyMobile extends MobileBasePage {
  async myAction() {
    // Platform detection
    if (this.isIOS) {
      // iOS specific
    } else if (this.isAndroid) {
      // Android specific
    }
  }
}
```

**Available Mobile Methods:**
- `tap(selector)` - Mobile tap gesture
- `swipeUp(distance)` / `swipeDown(distance)` - Vertical swipes
- `swipeLeft(distance)` / `swipeRight(distance)` - Horizontal swipes
- `doubleTap(selector)` - Double tap
- `longPress(selector, duration)` - Long press
- `goBack()` - Platform-aware back navigation
- `closeKeyboard()` - Close soft keyboard
- `getPlatformSelector(iosSelector, androidSelector)` - Get platform selector
- `performPlatformAction(iosAction, androidAction)` - Execute platform-specific code

### Platform-Specific Selectors

```javascript
export class MyPage extends MobileBasePage {
  // Define selectors for each platform
  iosEmailInput = 'input[data-accessibility-id="email"]';
  androidEmailInput = 'input[data-testid="email"]';

  // Return platform-specific selector
  get emailInput() {
    return this.getPlatformSelector(
      this.iosEmailInput,
      this.androidEmailInput
    );
  }
}
```

**See [MOBILE_TESTING_GUIDE.md](./MOBILE_TESTING_GUIDE.md) for complete mobile testing documentation.**

## 🗂️ Test Data

Test data is organized in `data/testData.js`:

```javascript
import { testUsers, testProducts } from '../data/testData.js';

test('should login with test user', async ({ page }) => {
  const { email, password } = testUsers.validUser;
  // use email and password
});
```

## 🔧 Fixtures

Custom fixtures are available in `fixtures/testFixtures.js`:

- `basePage` - BasePage instance
- `authenticatedPage` - Already logged-in page
- `apiContext` - API testing context
- `mobileContext` - Mobile-specific methods

### Example: Using API Context

```javascript
test('should fetch user data', async ({ apiContext }) => {
  const response = await apiContext.get('/api/user/profile');
  expect(response.status).toBe(200);
  expect(response.data.email).toBe('user@example.com');
});
```

## 📚 Utilities

Helper functions are available in `utils/testHelpers.js`:

```javascript
import { generateRandomEmail, retry, wait } from '../utils/testHelpers.js';

test('should generate unique email', async () => {
  const email = generateRandomEmail();
  // email: user-1704067200000@test.com
});

test('should retry failed action', async () => {
  await retry(async () => {
    // Action that might fail
  }, 3, 1000);
});
```

## ✅ Best Practices

### 1. Use Page Objects

- Keep selectors in page objects
- Create reusable methods for common actions
- Avoid direct selector usage in tests

### 2. Use Test Data

- Centralize test data
- Use meaningful data across tests
- Avoid hardcoding values

### 3. Write Clear Test Names

```javascript
// Good
test('should display error message when login with invalid email', ...)

// Bad
test('login test', ...)
```

### 4. Follow AAA Pattern

```javascript
test('should do something', async () => {
  // Arrange - setup
  const data = prepareTestData();

  // Act - perform action
  await performAction(data);

  // Assert - verify results
  expect(result).toBe(expected);
});
```

### 5. Use Tags for Test Organization

```javascript
test('@smoke @login should login successfully', ...)
test('@regression @profile should update profile', ...)
```

### 6. Handle Waits Properly

```javascript
// Good - wait for specific element
await page.waitForSelector('.success-message');

// Avoid - arbitrary waits
// await page.waitForTimeout(5000);
```

### 7. Take Screenshots on Failure

Screenshots are automatically taken on failure (configured in playwright.config.js).

### 8. Use Fixtures for Setup/Teardown

```javascript
test.beforeEach(async ({ basePage }) => {
  // Setup before each test
});

test.afterEach(async ({ page }) => {
  // Cleanup after each test
});
```

## 🐛 Debugging

### Debug Mode

```bash
npm run test:debug
```

### UI Mode

```bash
npm run test:ui
```

### View Trace

Traces are automatically collected on first retry. View with:

```bash
npx playwright show-trace path/to/trace.zip
```

### Console Logs

```javascript
test('should log data', async ({ page }) => {
  console.log('Current URL:', page.url());
});
```

## 📊 Reports

HTML reports are generated in `test-results/html/index.html`

```bash
npm run report
```

## 🔐 Security

- Never commit `.env` file
- Use environment variables for sensitive data
- Keep credentials in separate `.env` file
- Use `.gitignore` to exclude sensitive files

## 🤝 Contributing

1. Follow existing code structure
2. Use meaningful names for tests and functions
3. Add comments for complex logic
4. Update README for new features

## 📝 License

ISC

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Happy Testing!** 🎭
