# Mobile Testing Guide - iOS and Android

## 📱 Platform Separation Overview

This framework supports separate testing for iOS and Android with shared base classes and platform-specific implementations.

```
tests/
├── mobile/
│   ├── ios/
│   │   ├── login.ios.spec.js          # iOS-specific tests
│   │   └── features.ios.spec.js
│   ├── android/
│   │   ├── login.android.spec.js      # Android-specific tests
│   │   └── features.android.spec.js
│   └── api-ui-integration.spec.js     # Shared tests

pages/
├── MobileBasePage.js                  # Shared mobile base class
├── mobile/
│   ├── MobileLoginPage.js             # Shared login page with platform selectors
│   ├── MobileDashboardPage.js
│   └── ...

utils/mobile/
├── platformDetection.js               # Platform detection utilities
└── platformUtils.js                   # Platform-specific helpers
```

## 🎯 Running Platform-Specific Tests

### Run All Mobile Tests (Both Platforms)
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

### Run with Specific Project
```bash
npx playwright test --project='iPhone 12'
npx playwright test --project='Android Chrome'
npx playwright test --project='Android Samsung'
```

## 🏗️ Architecture

### Shared Base Classes

#### `MobileBasePage` - Shared Mobile Base
Extends `BasePage` with mobile-specific methods:

```javascript
import { MobileBasePage } from '../MobileBasePage.js';

export class MyMobilePage extends MobileBasePage {
  async someAction() {
    // Has access to platform detection
    if (this.isIOS) {
      // iOS-specific action
    } else {
      // Android-specific action
    }
  }
}
```

**Available Methods:**
- `tap(selector)` - Mobile tap
- `swipeUp(distance)` / `swipeDown(distance)` - Vertical swipes
- `swipeLeft(distance)` / `swipeRight(distance)` - Horizontal swipes
- `doubleTap(selector)` - Double tap
- `longPress(selector, duration)` - Long press
- `goBack()` - Platform-aware back navigation
- `closeKeyboard()` - Close soft keyboard
- `getPlatformSelector(iosSelector, androidSelector)` - Get platform selector
- `performPlatformAction(iosAction, androidAction)` - Execute platform-specific code

### Platform Detection

```javascript
import { isIOS, isAndroid, getPlatform } from '../utils/mobile/platformDetection.js';

// In your test or page object
async someAction({ page }) {
  if (isIOS(page)) {
    // iOS-specific behavior
  } else if (isAndroid(page)) {
    // Android-specific behavior
  }
}
```

## 📄 Writing Platform-Specific Tests

### Option 1: Separate Test Files

Create separate test files for each platform:

```
tests/mobile/ios/login.ios.spec.js
tests/mobile/android/login.android.spec.js
```

Use `testInfo.skip()` to run only on target platform:

```javascript
test.beforeEach(({ page }, testInfo) => {
  testInfo.skip(!testInfo.project.name.includes('iOS'), 'iOS specific');
});

test.describe('iOS Only Tests', () => {
  test('should handle iOS swipe gesture', async ({ page }) => {
    // iOS specific test
  });
});
```

### Option 2: Shared Test File with Platform Checks

```javascript
test('should login', async ({ page, basePage }) => {
  const loginPage = new MobileLoginPage(page);
  
  // Platform automatic detection in page object
  await loginPage.login('user@example.com', 'password');
  
  // Test runs on both platforms with platform-aware implementation
});
```

### Option 3: Parameterized Tests

```javascript
const platforms = ['iOS', 'Android'];

platforms.forEach((platform) => {
  test(`should work on ${platform}`, async ({ page }) => {
    if (platform === 'iOS' && !isIOS(page)) {
      test.skip();
    }
    if (platform === 'Android' && !isAndroid(page)) {
      test.skip();
    }
    
    // Test code
  });
});
```

## 💡 Writing Platform-Aware Page Objects

### With Platform Selectors

```javascript
export class LoginPage extends MobileBasePage {
  // iOS selectors
  iosEmailInput = 'input[data-accessibility-id="emailInput"]';
  // Android selectors
  androidEmailInput = 'input[data-testid="email_input"]';

  // Property that returns platform-specific selector
  get emailInput() {
    return this.getPlatformSelector(
      this.iosEmailInput,
      this.androidEmailInput
    );
  }

  async login(email, password) {
    // Automatically uses correct selector for platform
    await this.fillText(this.emailInput, email);
  }
}
```

### With Platform-Specific Actions

```javascript
export class DashboardPage extends MobileBasePage {
  async logout() {
    await this.performPlatformAction(
      // iOS action
      async () => {
        // iOS has back button at top
        await this.tap('button[aria-label="Back"]');
      },
      // Android action
      async () => {
        // Android has hardware back button
        await this.page.keyboard.press('Backspace');
      }
    );
  }
}
```

## 🧬 Platform Differences Reference

| Feature | iOS | Android |
|---------|-----|---------|
| Back Navigation | Swipe or button | Hardware back button |
| Test ID Attribute | accessibility-id | testId |
| Modal Dismissal | Swipe down | Tap outside or back |
| Keyboard | Tap done | Tap outside or back |
| Haptic Feedback | Native | Via vibration API |
| Safe Area | Top/bottom insets | No safe area |
| Volume Buttons | Access to volume | May trigger system |
| Home Indicator | Always present | Gesture area |
| Status Bar | Dynamic | Smaller |

## 📊 Platform-Specific Viewport Sizes

```javascript
// iOS
iPhone SE:     375 × 667
iPhone 12:     390 × 844
iPhone 14 Pro: 393 × 852
iPad:          768 × 1024
iPad Pro:      1024 × 1366

// Android
Pixel 4:       353 × 745
Pixel 5:       393 × 851
Galaxy S21:    360 × 800
Galaxy Note:   360 × 800
```

Use in tests:
```javascript
test('should display on device', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12
});
```

## 🔍 Platform Detection Examples

### Detect in Tests
```javascript
import { isIOS, isAndroid } from '../utils/mobile/platformDetection.js';

test('platform detection', async ({ page }) => {
  if (isIOS(page)) {
    // Run iOS-specific assertion
    await page.locator('ios-specific-element').isVisible();
  }
});
```

### Detect in Page Objects
```javascript
export class MyPage extends MobileBasePage {
  async setup() {
    if (this.isIOS) {
      // iOS setup
      await this.setupForIOS();
    } else {
      // Android setup
      await this.setupForAndroid();
    }
  }
}
```

## 🛠️ Platform Utilities

### Get Selectors
```javascript
import { getAndroidTestID, getIOSAccessibilityID } from '../utils/mobile/platformUtils.js';

const iosSelector = getIOSAccessibilityID('loginButton');
const androidSelector = getAndroidTestID('login_button');
```

### Handle Platform-Specific Back Navigation
```javascript
import { handleBackNavigation } from '../utils/mobile/platformUtils.js';

await handleBackNavigation(page, true); // true for iOS
```

### Get Platform Viewports
```javascript
import { getPlatformViewports } from '../utils/mobile/platformUtils.js';

const viewports = getPlatformViewports();
const iphoneSize = viewports['iPhone 12']; // { width: 390, height: 844 }
```

## 📱 Device-Specific Testing

### Test Multiple Devices

```javascript
test('should work on various iOS devices', async ({ browserName, page }) => {
  const devices = [
    { size: { width: 375, height: 667 }, name: 'iPhone SE' },
    { size: { width: 390, height: 844 }, name: 'iPhone 12' },
  ];

  for (const device of devices) {
    await page.setViewportSize(device.size);
    // Run test on each device
    await testLoginFlow(page);
  }
});
```

### Test Orientation Changes

```javascript
test('should handle orientation change on iOS', async ({ page }) => {
  // Portrait
  await page.setViewportSize({ width: 390, height: 844 });

  // Landscape
  await page.setViewportSize({ width: 844, height: 390 });

  // Verify UI adapts
  expect(await page.isVisible('button')).toBeTruthy();
});
```

## 🔐 Platform-Specific Authentication

```javascript
export class AuthFixture {
  async loginForPlatform(page, email, password) {
    const loginPage = new MobileLoginPage(page);
    
    // Platform-aware login
    await loginPage.login(email, password);
    
    // Handle platform-specific post-login behavior
    if (loginPage.isIOS) {
      // iOS might show tip/tutorial
      await page.locator('button:text("Got it")').click();
    } else {
      // Android might show permissions dialog
      await page.locator('button:text("Allow")').click();
    }
  }
}
```

## 🐛 Debugging Platform-Specific Issues

### Debug Single Platform
```bash
# Debug iOS only
npx playwright test tests/mobile/ios --project='iPhone 12' --debug

# Debug Android only
npx playwright test tests/mobile/android --project='Android Chrome' --debug
```

### View Platform in Screenshots
```javascript
async takeScreenshot(filename) {
  const platformName = this.isIOS ? 'ios' : 'android';
  const screenshotName = `${platformName}-${filename}`;
  await super.takeScreenshot(screenshotName);
}
```

### Log Platform Information
```javascript
import { getPlatformCapabilities } from '../utils/mobile/platformDetection.js';

test('platform info', async ({ page }) => {
  const caps = getPlatformCapabilities(page);
  console.log('Platform:', caps.platform);
  console.log('Is iOS:', caps.isIOS);
  console.log('Is Android:', caps.isAndroid);
  console.log('Status bar height:', caps.statusBarHeight);
});
```

## ✅ Best Practices

1. **Use page objects** to handle platform differences
2. **Centralize selectors** in one place with getter methods
3. **Use `performPlatformAction`** for different behaviors
4. **Create separate test files** for iOS-only and Android-only features
5. **Test on actual devices** when possible (use BrowserStack/Sauce Labs)
6. **Mock platform-specific APIs** in your app for testing
7. **Use accessibility IDs** for iOS and testID attributes for Android
8. **Handle safe areas** and notches in your app
9. **Test orientation changes** separately
10. **Keep permissions handling** separate per platform

## 🔗 Related Files

- [README.md](./README.md) - General framework documentation
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [pages/MobileBasePage.js](./pages/MobileBasePage.js) - Mobile base class
- [utils/mobile/platformDetection.js](./utils/mobile/platformDetection.js) - Platform detection
- [utils/mobile/platformUtils.js](./utils/mobile/platformUtils.js) - Platform utilities

---

**Ready to test on multiple platforms!** 🚀
