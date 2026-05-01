# Platform-Specific Page Objects - Quick Reference

## Factory Pattern (Recommended)

```javascript
import { PageObjectFactory } from '../../pages/mobile/PageObjectFactory.js';

// Automatically returns correct page object for platform
const loginPage = PageObjectFactory.getLoginPage(page);
const dashboardPage = PageObjectFactory.getDashboardPage(page);
const profilePage = PageObjectFactory.getProfilePage(page);
```

**Best For:** Cross-platform tests that should work on both iOS and Android

---

## iOS Page Objects

### Import
```javascript
import { IOSLoginPage } from '../../pages/mobile/ios/IOSLoginPage.js';
import { IOSDashboardPage } from '../../pages/mobile/ios/IOSDashboardPage.js';
```

### Common Methods
```javascript
// Navigation
await page.tap(selector);               // Tap element
await page.goBackIOS();                 // Tap iOS back button
await page.swipeDown();                 // Swipe to dismiss sheet

// Keyboard
await page.keyboard.press('Enter');     // Submit via keyboard
await page.keyboard.press('Escape');    // Dismiss keyboard

// Input
await page.fill(selector, 'text');      // Fill input
await page.type(selector, 'text');      // Type text

// Gestures
await page.tap(selector);               // Single tap
await page.doubleTap(selector);         // Double tap
await page.longPress(selector);         // Long press
await page.swipeDown();                 // Swipe down (dismiss)
await page.swipeUp();                   // Swipe up (navigate)
await page.pullToRefresh();             // Pull-to-refresh

// iOS-Specific
await page.handleBiometricAuth();       // Face ID
await page.adjustForNotch();            // Get safe area
await page.triggerHaptic();             // Haptic feedback
await page.setAccessibilityFocus(sel);  // VoiceOver
await page.announceForAccessibility(msg); // VoiceOver announce
await page.dismissModal();              // Swipe down to dismiss
```

### Selectors
```javascript
// Use data-accessibility-id for iOS
'[data-accessibility-id="email-input"]'
'[data-accessibility-id="login-button"]'
'[data-accessibility-id="profile-sheet"]'
```

### Example Test
```javascript
test('iOS login with Face ID', async ({ page }, testInfo) => {
  testInfo.skip(!testInfo.project.name.includes('iPhone'), 'iOS only');
  
  const loginPage = new IOSLoginPage(page);
  await loginPage.goto('/');
  
  // iOS-specific features
  await loginPage.handleBiometricAuth();
  await loginPage.adjustForNotch();
  await loginPage.triggerHaptic();
  
  // Common flow
  await loginPage.login('user@example.com', 'password');
  expect(page.url()).toContain('dashboard');
});
```

---

## Android Page Objects

### Import
```javascript
import { AndroidLoginPage } from '../../pages/mobile/android/AndroidLoginPage.js';
import { AndroidDashboardPage } from '../../pages/mobile/android/AndroidDashboardPage.js';
```

### Common Methods
```javascript
// Navigation
await page.tap(selector);               // Tap element
await page.goBackAndroid();             // Navigate back
await page.keyboard.press('Backspace'); // Hardware back button

// Keyboard (IME)
await page.fill(selector, 'text');      // Fill input
await page.type(selector, 'text');      // Type text
await page.closeAndroidKeyboard();      // Close IME

// Input
await page.fill(selector, 'text');      // Fill input
await page.type(selector, 'text');      // Type text

// Gestures
await page.tap(selector);               // Single tap
await page.doubleTap(selector);         // Double tap
await page.longPress(selector);         // Long press
await page.swipeToRefresh();            // Swipe-to-refresh (MDC)

// Android-Specific
await page.handleBiometricAuth();       // Fingerprint/Face
await page.handlePermissionsDialog();   // Handle permissions
await page.closeAndroidKeyboard();      // Close IME
await page.handleRotation();            // Handle rotation
await page.fireConfigurationChange();   // Configuration change
await page.triggerVibration();          // Vibration
await page.dismissModal();              // Press back/close
await page.clickFAB();                  // Floating Action Button
```

### Selectors
```javascript
// Use data-testid for Android
'[data-testid="email-input"]'
'[data-testid="login-button"]'
'[data-testid="profile-dialog"]'
```

### Example Test
```javascript
test('Android login with permissions', async ({ page }, testInfo) => {
  testInfo.skip(!testInfo.project.name.includes('Android'), 'Android only');
  
  const loginPage = new AndroidLoginPage(page);
  await loginPage.goto('/');
  
  // Android-specific features
  await loginPage.handlePermissionsDialog();
  await loginPage.triggerVibration();
  await loginPage.handleRotation();
  
  // Common flow
  await loginPage.login('user@example.com', 'password');
  expect(page.url()).toContain('dashboard');
});
```

---

## Side-by-Side Comparison

| Feature | iOS | Android |
|---------|-----|---------|
| **Base Class** | IOSBasePage | AndroidBasePage |
| **Selector Type** | data-accessibility-id | data-testid |
| **Modal Type** | Sheet | Dialog |
| **Modal Dismiss** | Swipe down | Back button |
| **Back Button** | Tap button | Hardware button |
| **Biometric** | Face ID/Touch ID | Fingerprint/Face |
| **Keyboard** | Done button | IME + back |
| **Feedback** | Haptics | Vibration |
| **Refresh** | Pull-to-refresh | Swipe-to-refresh |

---

## Test Execution

```bash
# All tests (web + iOS + Android)
npm test

# iOS only
npm run test:ios

# Android only
npm run test:android

# Specific device
npm run test:iphone          # iPhone 12
npm run test:iphone-se       # iPhone SE
npm run test:pixel           # Pixel 5

# Debug modes
npm run test -- --debug      # VS Code debugger
npm run test:headed          # Visible browser
npm run test:ui              # Playwright UI
```

---

## Best Practices

### ✅ DO
```javascript
// Use factory for cross-platform tests
const loginPage = PageObjectFactory.getLoginPage(page);

// Test framework provides platform info
test('login', async ({ page }, testInfo) => {
  const loginPage = PageObjectFactory.getLoginPage(page);
  // Same test runs on iPhone 12, iPhone SE, Pixel 5, Galaxy S21
});

// Direct iOS/Android for platform-specific tests
test('iOS specific', async ({ page }, testInfo) => {
  testInfo.skip(!testInfo.project.name.includes('iPhone'), 'iOS only');
  const loginPage = new IOSLoginPage(page);
});
```

### ❌ DON'T
```javascript
// Don't mix old MobileLoginPage with new objects
import { MobileLoginPage } from '../../pages/mobile/MobileLoginPage.js'; // ❌ Old

// Don't check platform manually (factory does it)
if (isIOS(page)) {
  const page = new IOSLoginPage(page);
} else {
  const page = new AndroidLoginPage(page);
} // ❌ Verbose - use factory instead

// Don't use wrong selectors
const email = '[data-testid="email"]';        // ❌ Wrong on iOS
const email = '[data-accessibility-id="email"]'; // ❌ Wrong on Android
```

---

## File Structure

```
pages/mobile/
├── MobileBasePage.js (base with platform detection)
├── PageObjectFactory.js ⭐ Use this
├── ios/
│  ├── IOSBasePage.js
│  ├── IOSLoginPage.js
│  ├── IOSDashboardPage.js
│  └── ...
├── android/
│  ├── AndroidBasePage.js
│  ├── AndroidLoginPage.js
│  ├── AndroidDashboardPage.js
│  └── ...

tests/mobile/
├── page-object-factory-tests.spec.js ⭐ Reference
├── ios/
│  └── login.ios.spec.js ⭐ Updated
├── android/
│  └── login.android.spec.js ⭐ Updated
└── shared-mobile-tests.spec.js (use factory)
```

---

## Common Patterns

### Pattern 1: Setup with Factory
```javascript
let loginPage;

test.beforeEach(async ({ page }, testInfo) => {
  testInfo.skip(testInfo.project.name === 'web', 'Mobile only');
  
  loginPage = PageObjectFactory.getLoginPage(page);
  await loginPage.goto('/');
  await loginPage.verifyPageLoaded();
});

test('login', async () => {
  await loginPage.login('user@example.com', 'password');
  expect(true).toBeTruthy();
});
```

### Pattern 2: Platform-Specific Logic
```javascript
test('login with platform-specific setup', async ({ page }) => {
  const loginPage = PageObjectFactory.getLoginPage(page);
  
  // Factory returns correct type, so instanceof works
  if (loginPage instanceof IOSLoginPage) {
    await loginPage.handleBiometricAuth();
  } else if (loginPage instanceof AndroidLoginPage) {
    await loginPage.handlePermissionsDialog();
  }
  
  // Rest of test is identical
  await loginPage.login('user@example.com', 'password');
});
```

### Pattern 3: Parallel Setup
```javascript
test.describe.parallel('Mobile Tests', () => {
  test('iOS specific', async ({ page }, testInfo) => {
    testInfo.skip(!testInfo.project.name.includes('iPhone'));
    const login = new IOSLoginPage(page);
    // iOS test
  });

  test('Android specific', async ({ page }, testInfo) => {
    testInfo.skip(!testInfo.project.name.includes('Android'));
    const login = new AndroidLoginPage(page);
    // Android test
  });

  test('cross-platform', async ({ page }) => {
    const login = PageObjectFactory.getLoginPage(page);
    // Runs on all platforms
  });
});
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Selector not found | Check correct selector type (data-accessibility-id vs data-testid) |
| Factory returns wrong type | Verify test is running on correct platform (npm run test:ios) |
| Method doesn't exist | Verify using correct page object class for platform |
| Platform detection failing | Check project name in playwright.config.js includes 'iPhone' or 'Android' |
| Keyboard issues on iOS | Use `.keyboard.press('Enter')` instead of `.tap()` |
| Back button not working | Use `.keyboard.press('Backspace')` on Android |

---

## Resources

- **Examples:** `tests/mobile/page-object-factory-tests.spec.js`
- **iOS Tests:** `tests/mobile/ios/login.ios.spec.js`
- **Android Tests:** `tests/mobile/android/login.android.spec.js`
- **Implementation:** `pages/mobile/PageObjectFactory.js`
- **Full Guide:** `UPDATED_PAGE_OBJECTS_GUIDE.md`
- **Summary:** `PHASE_3_SUMMARY.md`
