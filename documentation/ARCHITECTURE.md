# Framework Architecture & Index

## 📊 Complete Framework Overview

This document provides a comprehensive index of all framework components and their relationships.

## 🗂️ Directory Structure

```
TelemaxAutomation/
│
├── 📄 Configuration Files
│   ├── playwright.config.js          # Main Playwright config (web, iOS, Android)
│   ├── package.json                  # Dependencies, scripts, metadata
│   ├── .env.example                  # Environment variables template
│   ├── .gitignore                    # Git ignore rules
│   └── tsconfig.json (optional)      # TypeScript config
│
├── 📚 Documentation
│   ├── README.md                     # Main documentation
│   ├── QUICKSTART.md                 # Quick start guide
│   ├── MOBILE_TESTING_GUIDE.md       # Mobile (iOS/Android) testing
│   ├── PLATFORM_SEPARATION_GUIDE.md  # Platform architecture
│   └── ARCHITECTURE.md               # This file
│
├── 📄 Pages - UI Interaction Layer
│   ├── BasePage.js                   # Web base class
│   ├── MobileBasePage.js             # Mobile base (iOS + Android)
│   │
│   ├── Web Page Objects
│   │   ├── LoginPage.js
│   │   ├── DashboardPage.js
│   │   ├── FormPage.js
│   │   └── TablePage.js
│   │
│   └── mobile/
│       ├── MobileLoginPage.js        # Shared iOS/Android login
│       ├── MobileDashboardPage.js    # Shared iOS/Android dashboard
│       └── ... other mobile pages
│
├── 🧪 Tests
│   ├── Web Tests
│   │   ├── login.spec.js
│   │   ├── e2e.spec.js
│   │   └── api.spec.js
│   │
│   └── mobile/
│       ├── ios/
│       │   ├── login.ios.spec.js     # iOS-specific tests
│       │   └── ... iOS features
│       │
│       ├── android/
│       │   ├── login.android.spec.js # Android-specific tests
│       │   └── ... Android features
│       │
│       └── shared-mobile-tests.spec.js # Cross-platform tests
│
├── 🛠️ Utilities - Helper Functions
│   ├── testHelpers.js                # General test utilities
│   ├── apiHelpers.js                 # API testing helpers
│   ├── validationHelpers.js          # Validation functions
│   │
│   └── mobile/
│       ├── platformDetection.js      # Platform detection
│       └── platformUtils.js          # Platform utilities
│
├── 📦 Fixtures - Test Setup/Teardown
│   └── testFixtures.js               # Custom test fixtures
│
├── 📊 Data - Test Data
│   └── testData.js                   # Test objects, users, products
│
├── ⚙️ Config - Configuration
│   └── environment.js                # Environment-specific settings
│
└── 🔄 CI/CD
    └── .github/workflows/
        ├── playwright.yml             # Web & shared test workflows
        └── mobile-tests.yml           # iOS & Android test workflows
```

## 🎯 Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                         Tests                               │
├─────────────────────────────────────────────────────────────┤
│  ├─ Web Tests (login.spec.js, e2e.spec.js, api.spec.js)    │
│  └─ Mobile Tests                                            │
│     ├─ iOS Specific (tests/mobile/ios/)                     │
│     ├─ Android Specific (tests/mobile/android/)             │
│     └─ Shared Cross-Platform (tests/mobile/)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Page Objects (pages/)                      │
├─────────────────────────────────────────────────────────────┤
│  ├─ BasePage (web base)                                     │
│  │  ├─ LoginPage                                            │
│  │  ├─ DashboardPage                                        │
│  │  ├─ FormPage                                             │
│  │  └─ TablePage                                            │
│  │                                                          │
│  └─ MobileBasePage (mobile base)                            │
│     ├─ MobileLoginPage (pages/mobile/)                      │
│     ├─ MobileDashboardPage (pages/mobile/)                  │
│     └─ ... other mobile pages                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│               Utilities & Helpers (utils/)                  │
├─────────────────────────────────────────────────────────────┤
│  ├─ General                                                 │
│  │  ├─ testHelpers.js (generate, wait, retry, etc.)          │
│  │  ├─ apiHelpers.js (API request helpers)                  │
│  │  └─ validationHelpers.js (validation functions)          │
│  │                                                          │
│  └─ mobile/                                                 │
│     ├─ platformDetection.js (isIOS, isAndroid, etc.)       │
│     └─ platformUtils.js (platform-specific utilities)       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         Fixtures & Data (fixtures/, data/, config/)         │
├─────────────────────────────────────────────────────────────┤
│  ├─ testFixtures.js (basePage, authenticatedPage, etc.)     │
│  ├─ testData.js (users, products, forms)                    │
│  └─ environment.js (dev, staging, production)               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│        Playwright Configuration (playwright.config.js)       │
├─────────────────────────────────────────────────────────────┤
│  ├─ Web Browsers (Chromium, Firefox, Safari)               │
│  ├─ iOS Devices (iPhone 12, iPhone SE)                      │
│  └─ Android Devices (Pixel 5, Galaxy S21)                   │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Test Execution Flow

```
npm run test:ios / test:android / test:web
           ↓
playwright.config.js (select projects)
           ↓
Test File Selection (based on project)
           ↓
Fixtures Setup (testFixtures.js)
           ↓
Page Object Instantiation
           ↓
Platform Detection (if mobile)
           ↓
Test Execution
           ↓
Assertions
           ↓
Report Generation
```

### Page Object Instantiation (Mobile)

```
Test File
    ↓
new MobileLoginPage(page)
    ↓
MobileBasePage Constructor
    ↓
Platform Detection
    ├─ isIOS? → true/false
    ├─ isAndroid? → true/false
    └─ platform → 'ios'/'android'
    ↓
Ready for Method Calls
    ├─ tap(selector)
    ├─ swipeUp(distance)
    ├─ getPlatformSelector()
    └─ performPlatformAction()
```

## 📋 Usage Patterns

### 1. Writing Tests

```javascript
// Import
import { test, expect } from '../fixtures/testFixtures.js';
import { MobileLoginPage } from '../pages/mobile/MobileLoginPage.js';

// Use
test('login', async ({ page, authenticatedPage, apiContext }) => {
  // Select page object based on context
  const loginPage = new MobileLoginPage(page);
  
  // Use shared methods - automatically platform-aware
  await loginPage.login(email, password);
  
  // Use fixtures for authenticated state
  // Use apiContext for API calls
});
```

### 2. Creating Page Objects

```javascript
// Extend appropriate base
import { MobileBasePage } from '../MobileBasePage.js';

// Define platform-specific selectors
iosSelector = 'ios-specific';
androidSelector = 'android-specific';

// Return platform-appropriate selector
get selector() {
  return this.getPlatformSelector(
    this.iosSelector,
    this.androidSelector
  );
}

// Handle platform differences
async action() {
  await this.performPlatformAction(
    async () => { /* iOS */ },
    async () => { /* Android */ }
  );
}
```

### 3. Using Utilities

```javascript
// Import helpers
import { generateRandomEmail, wait, retry } from '../utils/testHelpers.js';
import { isValidEmail } from '../utils/validationHelpers.js';
import { isIOS } from '../utils/mobile/platformDetection.js';

// Use in tests
const email = generateRandomEmail();
expect(isValidEmail(email)).toBeTruthy();
await retry(() => someAction(), 3, 1000);
if (isIOS(page)) { /* iOS logic */ }
```

## 🏃 Running Tests

### Command Patterns

```bash
# All tests
npm test

# By type
npm run test:web      # Web
npm run test:mobile   # All mobile

# By platform (mobile)
npm run test:ios      # All iOS
npm run test:android  # All Android

# By specific device
npm run test:iphone        # iPhone 12
npm run test:iphone-se     # iPhone SE
npm run test:pixel         # Pixel 5

# Advanced (raw playwright)
npx playwright test --project="iPhone 12"
npx playwright test --grep @smoke
npx playwright test tests/web/login.spec.js --debug
```

## 🗝️ Key Components Explained

### `BasePage` (Web)
- Base class for web page objects
- Common methods: click, fillText, getText, waitForElement, etc.
- No platform-specific logic

### `MobileBasePage` (Mobile)
- Extends BasePage with mobile-specific methods
- Includes platform detection (iOS/Android)
- Methods: tap, swipe*, doubleTap, goBack, performPlatformAction, etc.
- Automatically detects platform on instantiation

### `testFixtures.js`
- Custom test fixtures extending Playwright's test
- Provides: basePage, authenticatedPage, apiContext, mobileContext
- Setup and teardown logic

### `platformDetection.js`
- Runtime platform detection
- Functions: isIOS(), isAndroid(), getPlatform()
- No build-time dependencies

### `playwright.config.js`
- Single configuration for web, iOS, and Android
- Defines projects with browser/device configurations
- Separate reporters for each
- Environment variable support

## 📊 Test Execution Matrix

```
┌──────────────┬──────────┬──────────┬──────────┐
│ Test Type    │ Platform │ Devices  │ Location │
├──────────────┼──────────┼──────────┼──────────┤
│ Web          │ Desktop  │ 3        │ /web     │
│ iOS Shared   │ iOS      │ 2        │ /mobile  │
│ iOS Specific │ iOS      │ 2        │ /ios     │
│ Android Share│ Android  │ 2        │ /mobile  │
│ Android Spec │ Android  │ 2        │ /android │
└──────────────┴──────────┴──────────┴──────────┘
```

## 🔗 File Dependencies

```
Test Files
    ↓
    ├→ fixtures/testFixtures.js
    │   └→ pages/BasePage.js or pages/MobileBasePage.js
    │       └→ Playwright Page API
    │
    ├→ data/testData.js
    │
    ├→ utils/*.js
    │   └→ Playwright utilities
    │
    └→ config/environment.js
        └→ process.env
```

## 🎨 Design Patterns

### 1. Page Object Model
- Encapsulates UI interaction
- Maintains selectors centrally
- Provides high-level methods

### 2. Platform Abstraction
- Platform detection at page object level
- Tests don't know about platform differences
- Shared selectors and actions where possible

### 3. Fixture-Based Setup
- common setup logic in fixtures
- Reusable test preconditions
- Dependency injection via fixtures

### 4. Environment Configuration
- Centralized configuration
- Environment-specific values
- Easy to switch environments

## 🚀 Performance Considerations

- **Parallel Execution**: Tests run in parallel by device
- **Browser Reuse**: Contexts reused where configured
- **Fixtures**: Pre-configured and cached
- **Screenshots**: Only on failure
- **Videos**: Only on failure
- **Traces**: Collected on first retry

## 🔐 Security Considerations

- Credentials in `.env` (not committed)
- Environment variables for sensitive data
- No hardcoded URLs or credentials
- Test data separated from implementation

## 📈 Scalability

Framework can scale to:
- ✅ 10+ test files
- ✅ 50+ tests
- ✅ Multiple environments
- ✅ Multiple platforms
- ✅ Multiple devices per platform
- ✅ CI/CD pipelines

## 🎓 Learning Path

1. **Start**: [QUICKSTART.md](./QUICKSTART.md)
2. **Basics**: [README.md](./README.md)
3. **Mobile**: [MOBILE_TESTING_GUIDE.md](./MOBILE_TESTING_GUIDE.md)
4. **Advanced**: [PLATFORM_SEPARATION_GUIDE.md](./PLATFORM_SEPARATION_GUIDE.md)
5. **Reference**: This file

## 🤝 Contributing

When adding new features:
1. Create page objects for UI interactions
2. Add utilities for repeated logic
3. Update test data as needed
4. Add documentation
5. Follow existing patterns

## 📞 Support

- See [README.md](./README.md) for general help
- See [MOBILE_TESTING_GUIDE.md](./MOBILE_TESTING_GUIDE.md) for mobile help
- Check existing tests for examples
- Enable debug mode with `--debug`

---

**Last Updated:** April 2026
**Framework Version:** 2.0 (iOS/Android separated)
