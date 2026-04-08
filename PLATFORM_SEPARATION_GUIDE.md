# iOS and Android Framework Separation

## 📋 Overview

The framework has been refactored to support separate iOS and Android testing with shared base classes and platform-specific implementations.

## 🏗️ Architecture

### Shared Base Classes
- **`MobileBasePage`** - Platform-agnostic mobile base with iOS/Android detection
- **Platform-specific page objects** in `pages/mobile/` extend `MobileBasePage`

### Platform-Specific Tests
- `tests/mobile/ios/` - iOS-only tests
- `tests/mobile/android/` - Android-only tests
- `tests/mobile/shared-mobile-tests.spec.js` - Tests running on both platforms

### Platform Detection
- `utils/mobile/platformDetection.js` - Platform detection utilities
- `utils/mobile/platformUtils.js` - Platform-specific helpers

## 📁 New Directory Structure

```
tests/mobile/
├── ios/
│   ├── login.ios.spec.js        # iOS-specific tests
│   └── features.ios.spec.js
├── android/
│   ├── login.android.spec.js    # Android-specific tests
│   └── features.android.spec.js
└── shared-mobile-tests.spec.js  # Cross-platform tests

pages/mobile/
├── MobileLoginPage.js           # Shared with platform selectors
├── MobileDashboardPage.js
└── ...

utils/mobile/
├── platformDetection.js         # isIOS(), isAndroid(), etc.
└── platformUtils.js             # Platform utilities
```

## 🎯 Key Changes

### 1. Shared Base Class
```javascript
import { MobileBasePage } from '../MobileBasePage.js';

export class MyPage extends MobileBasePage {
  // Automatically has:
  // - this.isIOS
  // - this.isAndroid
  // - this.platform
  // - Platform detection methods
}
```

### 2. Platform Selectors
```javascript
get emailInput() {
  return this.getPlatformSelector(
    this.iosEmailInput,      // iOS selector
    this.androidEmailInput   // Android selector
  );
}
```

### 3. Platform-Specific Actions
```javascript
async logout() {
  await this.performPlatformAction(
    // iOS action
    async () => {
      await this.tap('button[aria-label="Back"]');
    },
    // Android action
    async () => {
      await this.page.keyboard.press('Backspace');
    }
  );
}
```

## 🚀 Running Tests

### All Mobile Tests (iOS & Android)
```bash
npm run test:mobile
```

### iOS Tests Only
```bash
npm run test:ios                # Both iOS devices
npm run test:iphone             # iPhone 12 only
npm run test:iphone-se          # iPhone SE only
```

### Android Tests Only
```bash
npm run test:android            # All Android devices
npm run test:pixel              # Pixel 5 only
```

## 📊 Configuration

### Playwright Config
`playwright.config.js` now includes:

```javascript
// iOS Projects
{
  name: 'iPhone 12',
  use: { ...devices['iPhone 12'] },
  testDir: './tests/mobile',
},
{
  name: 'iPhone SE',
  use: { ...devices['iPhone SE'] },
  testDir: './tests/mobile',
},

// Android Projects
{
  name: 'Android Chrome',
  use: { ...devices['Pixel 5'] },
  testDir: './tests/mobile',
},
{
  name: 'Android Samsung',
  use: { ...devices['Galaxy S21'] },
  testDir: './tests/mobile',
},
```

### NPM Scripts
```json
{
  "test:mobile": "playwright test tests/mobile",
  "test:ios": "playwright test tests/mobile/ios --project='iPhone 12' --project='iPhone SE'",
  "test:android": "playwright test tests/mobile/android --project='Android Chrome' --project='Android Samsung'",
  "test:iphone": "playwright test tests/mobile/ios --project='iPhone 12'",
  "test:iphone-se": "playwright test tests/mobile/ios --project='iPhone SE'",
  "test:pixel": "playwright test tests/mobile/android --project='Android Chrome'"
}
```

## 📝 Writing Tests

### Platform-Specific Tests
```javascript
// tests/mobile/ios/feature.ios.spec.js
test.beforeEach(({ page }, testInfo) => {
  testInfo.skip(!testInfo.project.name.includes('iOS'));
});

test.describe('iOS Only', () => {
  test('iOS feature', async ({ page }) => {
    // iOS-specific test
  });
});
```

### Shared Tests
```javascript
// tests/mobile/shared-mobile-tests.spec.js
test('both platforms', async ({ page }) => {
  const loginPage = new MobileLoginPage(page);
  
  // Page object automatically handles platform differences
  await loginPage.login(email, password);
  
  expect(page.url()).toContain('dashboard');
});
```

## 🎭 Mobile Page Objects

### Available Methods
- `tap(selector)` - Mobile tap
- `swipeUp(distance)` - Swipe up
- `swipeDown(distance)` - Swipe down
- `swipeLeft(distance)` - Swipe left
- `swipeRight(distance)` - Swipe right
- `doubleTap(selector)` - Double tap
- `longPress(selector)` - Long press
- `goBack()` - Platform-aware back button
- `closeKeyboard()` - Close soft keyboard
- `getPlatformSelector(ios, android)` - Get platform selector
- `performPlatformAction(iosAction, androidAction)` - Execute platform code

## 🔍 Platform Detection

```javascript
import { isIOS, isAndroid, getPlatform } from '../utils/mobile/platformDetection.js';

test('platform', async ({ page }) => {
  if (isIOS(page)) {
    // iOS specific assertion
  } else if (isAndroid(page)) {
    // Android specific assertion
  }
  
  const platform = getPlatform(page); // 'ios' or 'android'
});
```

## 📱 Device Viewports

Supported devices with viewports:

### iOS
- iPhone SE: 375 × 667
- iPhone 12: 390 × 844
- iPhone 14 Pro: 393 × 852
- iPad: 768 × 1024
- iPad Pro: 1024 × 1366

### Android
- Pixel 4: 353 × 745
- Pixel 5: 393 × 851
- Galaxy S10: 360 × 800
- Galaxy S21: 360 × 800
- Galaxy Note 20: 360 × 800

## 🔄 CI/CD Pipeline

### GitHub Actions
- `.github/workflows/mobile-tests.yml` - Separate iOS/Android jobs
- `.github/workflows/playwright.yml` - Original web tests workflow

Runs:
- iOS Tests (iPhone 12, iPhone SE) in parallel
- Android Tests (Pixel 5, Galaxy S21) in parallel
- Web Tests
- Shared Mobile Tests
- Generates separate reports per platform

## 💡 Best Practices

### 1. Use Page Objects
```javascript
// ✅ Good
const loginPage = new MobileLoginPage(page);
await loginPage.login(email, password);

// ❌ Avoid
await page.fill('input[name="email"]', email);
```

### 2. Handle Platform Differences in Page Objects
```javascript
// ✅ Good - in page object
get backButton() {
  return this.getPlatformSelector(
    'button[aria-label="Back"]',    // iOS
    'button.android-back-button'     // Android
  );
}

// ❌ Avoid - in test file
if (isIOS(page)) {
  await page.click('button[aria-label="Back"]');
}
```

### 3. Use Shared Gestures
```javascript
// ✅ Good - works on all platforms
await page.swipeUp(100);
await page.tap(selector);
await page.longPress(selector);

// ❌ Avoid - platform-specific hacks
if (isIOS(page)) {
  // Native iOS gesture
}
```

### 4. Keep Platform-Specific Tests Separate
```
// ✅ Good
tests/mobile/ios/feature.ios.spec.js    # iOS-only feature
tests/mobile/android/feature.android.spec.js  # Android-only feature
tests/mobile/shared-feature.spec.js     # Works on both
```

### 5. Use Appropriate Selectors
```javascript
// iOS - Use accessibility-id
iosSelector = 'input[data-accessibility-id="email"]';

// Android - Use data-testid
androidSelector = 'input[data-testid="email"]';
```

## 🚨 Migration Guide

### If you have existing mobile tests:

1. **Move test files**
   ```
   tests/mobile/old-test.spec.js
   → tests/mobile/shared-mobile-tests.spec.js (shared)
   → tests/mobile/ios/feature.ios.spec.js (iOS-only)
   → tests/mobile/android/feature.android.spec.js (Android-only)
   ```

2. **Update imports**
   ```javascript
   // Old
   import { LoginPage } from '../pages/LoginPage.js';

   // New - for mobile
   import { MobileLoginPage } from '../pages/mobile/MobileLoginPage.js';
   ```

3. **Update page objects**
   ```javascript
   // Old
   export class LoginPage extends BasePage {}

   // New - for mobile
   export class MobileLoginPage extends MobileBasePage {}
   ```

## 📚 Documentation

- [README.md](./README.md) - General framework docs
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [MOBILE_TESTING_GUIDE.md](./MOBILE_TESTING_GUIDE.md) - Comprehensive mobile testing guide
- [pages/MobileBasePage.js](./pages/MobileBasePage.js) - Mobile base class
- [utils/mobile/](./utils/mobile/) - Platform utilities

## ✅ Checklist for Using New Framework

- ✓ Run `npm install` to install dependencies
- ✓ Create page objects extending `MobileBasePage`
- ✓ Use `getPlatformSelector()` for different selectors
- ✓ Use `performPlatformAction()` for different behaviors
- ✓ Create iOS-specific tests in `tests/mobile/ios/`
- ✓ Create Android-specific tests in `tests/mobile/android/`
- ✓ Create shared tests in `tests/mobile/`
- ✓ Run `npm run test:ios` or `npm run test:android`
- ✓ Check test results per platform

## 🤔 FAQ

**Q: Can I run the same test on both iOS and Android?**
A: Yes! Write platform-aware page objects and the same test runs on both.

**Q: How do I handle platform-specific selectors?**
A: Use `getPlatformSelector()` method in your page object.

**Q: Where should I put my test file?**
A: 
- iOS-only → `tests/mobile/ios/`
- Android-only → `tests/mobile/android/`
- Both → `tests/mobile/`

**Q: How do I debug platform-specific issues?**
A: Use `npm run test:debug` with `--project='iPhone 12'` or `--project='Pixel 5'`

**Q: Can I run multiple devices in parallel?**
A: Yes! GitHub Actions runs them in parallel across multiple jobs.

---

**Happy cross-platform testing!** 🚀
