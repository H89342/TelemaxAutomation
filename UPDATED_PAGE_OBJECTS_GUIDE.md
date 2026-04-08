/**
 * UPDATED TEST MIGRATION GUIDE
 * How to use the new platform-specific page objects and PageObjectFactory
 * 
 * VERSION: Updated for Phase 3
 * CREATED: Today
 * PURPOSE: Guide developers in using new OS-specific page objects
 */

/**
 * ============================================================================
 * QUICK START - Three Ways to Use Page Objects
 * ============================================================================
 */

// Method 1: FACTORY PATTERN (RECOMMENDED - Works on all platforms)
// ✅ Best for cross-platform tests
// ✅ Automatic platform detection
// ✅ Clean test code (no if/else statements)
// ✅ Single test runs on both iOS and Android

import { test, expect } from '../../fixtures/testFixtures.js';
import { PageObjectFactory } from '../../pages/mobile/PageObjectFactory.js';

test('cross-platform login', async ({ page }) => {
  // Factory automatically returns correct page object:
  // - iOS devices → IOSLoginPage
  // - Android devices → AndroidLoginPage
  const loginPage = PageObjectFactory.getLoginPage(page);
  
  await loginPage.login('user@example.com', 'password');
  expect(page.url()).toContain('dashboard');
});

/**
 * ============================================================================
 * Method 2: DIRECT iOS USAGE (iOS tests only)
 * ============================================================================
 */

import { IOSLoginPage } from '../../pages/mobile/ios/IOSLoginPage.js';
import { IOSDashboardPage } from '../../pages/mobile/ios/IOSDashboardPage.js';

test('iOS-specific features', async ({ page }) => {
  const loginPage = new IOSLoginPage(page);
  
  // Explicit iOS methods available
  await loginPage.handleBiometricAuth(); // Face ID
  await loginPage.adjustForNotch(); // iPhone X/12/14 notch
  await loginPage.triggerHaptic(); // Vibration feedback
  await loginPage.announceForAccessibility('Ready'); // VoiceOver
});

test('iOS dashboard with sheets', async ({ page, authenticatedPage }) => {
  const dashboard = new IOSDashboardPage(authenticatedPage.page);
  
  // iOS-specific patterns
  await dashboard.openProfile(); // Shows iOS sheet
  await dashboard.pullToRefresh(); // Pull gesture
  await dashboard.dismissModal(); // Swipe down to dismiss
});

/**
 * ============================================================================
 * Method 3: DIRECT ANDROID USAGE (Android tests only)
 * ============================================================================
 */

import { AndroidLoginPage } from '../../pages/mobile/android/AndroidLoginPage.js';
import { AndroidDashboardPage } from '../../pages/mobile/android/AndroidDashboardPage.js';

test('Android-specific features', async ({ page }) => {
  const loginPage = new AndroidLoginPage(page);
  
  // Explicit Android methods available
  await loginPage.handlePermissionsDialog(); // Permission prompts
  await loginPage.handleBiometricAuth(); // Fingerprint/Face
  await loginPage.closeAndroidKeyboard(); // IME keyboard
  await loginPage.handleRotation(); // Screen rotation
});

test('Android dashboard with Material Design', async ({ page, authenticatedPage }) => {
  const dashboard = new AndroidDashboardPage(authenticatedPage.page);
  
  // Android-specific patterns
  await dashboard.openProfile(); // Shows Material dialog
  await dashboard.clickFAB(); // Floating Action Button
  await dashboard.swipeToRefresh(); // Swipe gesture
  await dashboard.handleConfigurationChange(); // Handle orientation
});

/**
 * ============================================================================
 * SELECTOR DIFFERENCES
 * ============================================================================
 */

// iOS uses data-accessibility-id (accessibility standard)
// <input data-accessibility-id="email-input" />

const iosEmail = 'input[data-accessibility-id="email-input"]';

// Android uses data-testid (testing standard)
// <input data-testid="email-input" />

const androidEmail = 'input[data-testid="email-input"]';

// Page objects handle this automatically!
const iOS = new IOSLoginPage(page);
const Android = new AndroidLoginPage(page);

// Both work correctly - selectors are platform-appropriate
await iOS.enterEmail('test@example.com'); // Uses accessibility-id
await Android.enterEmail('test@example.com'); // Uses testid

/**
 * ============================================================================
 * GESTURE DIFFERENCES
 * ============================================================================
 */

// SHARED GESTURES (works on both iOS and Android via MobileBasePage)
await loginPage.tap(selector); // Simple tap
await loginPage.longPress(selector); // Long press
await loginPage.doubleTap(selector); // Double tap
await loginPage.swipeUp(); // Swipe up
await loginPage.swipeDown(); // Swipe down

// iOS-SPECIFIC GESTURES
const iosPage = new IOSLoginPage(page);
await iosPage.pullToRefresh(); // Pull-to-refresh
await iosPage.swipeDown(); // Dismiss sheet

// Android-SPECIFIC GESTURES
const androidPage = new AndroidLoginPage(page);
await androidPage.swipeToRefresh(); // Material Design refresh
await androidPage.goBackAndroidNative(); // Hardware back

/**
 * ============================================================================
 * MODAL/DIALOG DIFFERENCES
 * ============================================================================
 */

// iOS: Uses Sheets (swipe down to dismiss)
const iosPage = new IOSLoginPage(page);
await iosPage.openProfile(); // Opens sheet
// ... do stuff in sheet ...
await iosPage.dismissModal(); // Swipes down

// Android: Uses Dialogs (back button to dismiss)
const androidPage = new AndroidLoginPage(page);
await androidPage.openProfile(); // Opens dialog
// ... do stuff in dialog ...
await androidPage.dismissModal(); // Presses back or closes

/**
 * ============================================================================
 * PLATFORM DETECTION AT RUNTIME
 * ============================================================================
 */

import { isIOS, isAndroid } from '../../utils/mobile/platformDetection.js';

// If you need platform-specific logic in tests:
test('conditional test', async ({ page }) => {
  const loginPage = PageObjectFactory.getLoginPage(page);
  
  if (isIOS(page)) {
    // iOS-specific assertions
    await expect(loginPage).toBeTruthy(); // Custom iOS checks
  } else if (isAndroid(page)) {
    // Android-specific assertions
    await expect(loginPage).toBeTruthy(); // Custom Android checks
  }
});

/**
 * ============================================================================
 * MIGRATION CHECKLIST - From Old to New Page Objects
 * ============================================================================
 */

// BEFORE: Using old MobileLoginPage (mixed iOS/Android)
import { MobileLoginPage } from '../../pages/mobile/MobileLoginPage.js';

test.beforeEach(async ({ page }) => {
  const loginPage = new MobileLoginPage(page); // Same page object for both
  await loginPage.goto('/login');
  // Problem: loginPage might have platform-specific code mixed in
});

// AFTER: Using new Factory Pattern (recommended)
import { PageObjectFactory } from '../../pages/mobile/PageObjectFactory.js';

test.beforeEach(async ({ page }) => {
  const loginPage = PageObjectFactory.getLoginPage(page); // Returns iOS or Android page object
  await loginPage.goto('/login');
  // ✅ Clean separation: iOS features in IOSLoginPage, Android in AndroidLoginPage
});

// OR: Using new Direct Approach (for platform-specific tests)
import { IOSLoginPage } from '../../pages/mobile/ios/IOSLoginPage.js';

test.beforeEach(async ({ page }, testInfo) => {
  testInfo.skip(!testInfo.project.name.includes('iPhone'), 'iOS only');
  const loginPage = new IOSLoginPage(page); // Explicit iOS page object
  await loginPage.goto('/login');
  // ✅ Clear that this test is iOS-specific
});

/**
 * ============================================================================
 * EXISTING TESTS - WHAT'S BEEN UPDATED
 * ============================================================================
 */

// Tests ALREADY UPDATED:
// ✅ tests/mobile/ios/login.ios.spec.js - Updated to use IOSLoginPage + Factory
// ✅ tests/mobile/android/login.android.spec.js - Updated to use AndroidLoginPage + Factory
// ✅ tests/mobile/page-object-factory-tests.spec.js - [NEW] Demonstrates all 3 methods

// Tests STILL NEED UPDATING:
// 📝 tests/mobile/shared-mobile-tests.spec.js - Should use Factory pattern
// 📝 Any custom test files using MobileLoginPage/MobileDashboardPage

/**
 * ============================================================================
 * FILE STRUCTURE - NEW ORGANIZATION
 * ============================================================================
 */

// Old structure (Phase 1-2):
// pages/mobile/
//   ├─ MobileLoginPage.js (shared, mixed iOS/Android)
//   ├─ MobileDashboardPage.js (shared, mixed iOS/Android)
//   └─ MobileBasePage.js (base with platform detection)

// New structure (Phase 3 - CURRENT):
// pages/mobile/
//   ├─ MobileBasePage.js (base with platform detection)
//   ├─ PageObjectFactory.js (automatic platform selection) ⭐ NEW
//   ├─ ios/
//   │  ├─ IOSBasePage.js (iOS-specific base) ⭐ NEW
//   │  ├─ IOSLoginPage.js (iOS login) ⭐ NEW
//   │  └─ IOSDashboardPage.js (iOS dashboard) ⭐ NEW
//   └─ android/
//      ├─ AndroidBasePage.js (Android-specific base) ⭐ NEW
//      ├─ AndroidLoginPage.js (Android login) ⭐ NEW
//      └─ AndroidDashboardPage.js (Android dashboard) ⭐ NEW

/**
 * ============================================================================
 * BENEFITS OF NEW APPROACH
 * ============================================================================
 */

// 1. CLEANER CODE
// Before: if (isIOS) { ... } else { ... }
// After: Factory handles it automatically

// 2. BETTER IDE SUPPORT
// Before: MobileLoginPage has both iOS and Android methods (confusing autocomplete)
// After: IOSLoginPage only shows iOS methods, AndroidLoginPage shows Android methods

// 3. EASIER DEBUGGING
// Before: Hard to know which platform code is executing
// After: IOSLoginPage or AndroidLoginPage - obvious at a glance

// 4. REDUCED TEST CODE MAINTENANCE
// Before: One file with platform checks everywhere
// After: iOS tests use IOSLoginPage, Android tests use AndroidLoginPage

// 5. PLATFORM-APPROPRIATE PATTERNS
// Before: Had to compromise on patterns (sheets vs dialogs, etc.)
// After: Each platform uses native patterns (iOS sheets, Android Material Design)

/**
 * ============================================================================
 * ADDING NEW PAGE OBJECTS
 * ============================================================================
 */

// Example: Adding a new ProfilePage

// Step 1: Create iOS version
// pages/mobile/ios/IOSProfilePage.js
class IOSProfilePage extends IOSBasePage {
  constructor(page) {
    super(page);
    this.profileSheetButton = '[data-accessibility-id="profile-sheet"]';
    this.editButton = '[data-accessibility-id="edit-button"]';
  }
  
  async openEditSheet() {
    await this.tap(this.editButton);
    await this.waitForSheet(this.profileSheetButton);
  }
  
  async dismissProfileSheet() {
    await this.dismissModal(); // iOS: swipe down
  }
}

// Step 2: Create Android version
// pages/mobile/android/AndroidProfilePage.js
class AndroidProfilePage extends AndroidBasePage {
  constructor(page) {
    super(page);
    this.profileDialogButton = '[data-testid="profile-dialog"]';
    this.editButton = '[data-testid="edit-button"]';
  }
  
  async openEditDialog() {
    await this.tap(this.editButton);
    await this.waitForDialog(this.profileDialogButton);
  }
  
  async dismissProfileDialog() {
    await this.dismissModal(); // Android: back button or close
  }
}

// Step 3: Update factory
// pages/mobile/PageObjectFactory.js
static getProfilePage(page, baseUrl) {
  return isIOS(page)
    ? new IOSProfilePage(page, baseUrl)
    : new AndroidProfilePage(page, baseUrl);
}

// Step 4: Use in tests
const profilePage = PageObjectFactory.getProfilePage(page);
await profilePage.openEditDialog(); // Works on both!

/**
 * ============================================================================
 * COMMON PATTERNS
 * ============================================================================
 */

// Pattern 1: Factory in test.beforeEach()
test.beforeEach(async ({ page }, testInfo) => {
  testInfo.skip(testInfo.project.name === 'web', 'Mobile only');
  
  const loginPage = PageObjectFactory.getLoginPage(page);
  await loginPage.goto('/');
  await loginPage.verifyPageLoaded();
  this.loginPage = loginPage;
});

// Pattern 2: Platform-specific setup
test('iOS and Android with different setup', async ({ page }, testInfo) => {
  const loginPage = PageObjectFactory.getLoginPage(page);
  
  if (loginPage instanceof IOSLoginPage) {
    // iOS-specific setup
    await loginPage.adjustForNotch();
  } else {
    // Android-specific setup
    await loginPage.handlePermissionsDialog();
  }
  
  // Common test
  await loginPage.login('user@example.com', 'password');
});

// Pattern 3: Shared tests running on both platforms
test('login works on both iOS and Android', async ({ page }) => {
  const loginPage = PageObjectFactory.getLoginPage(page);
  await loginPage.login('user@example.com', 'password');
  expect(page.url()).toContain('dashboard');
  // Runs on: iPhone 12, iPhone SE, Pixel 5, Galaxy S21
});

/**
 * ============================================================================
 * TROUBLESHOOTING
 * ============================================================================
 */

// Q: Getting "Cannot read property of undefined"?
// A: Make sure you imported the class:
//    import { IOSLoginPage } from '../../pages/mobile/ios/IOSLoginPage.js';

// Q: Selector not found on iOS?
// A: Verify you're using data-accessibility-id, not data-testid
//    iOS: [data-accessibility-id="..."]
//    Android: [data-testid="..."]

// Q: Factory returning wrong page object?
// A: Check platform detection. Run tests with:
//    npm run test:ios (for iOS)
//    npm run test:android (for Android)

// Q: Need to debug which platform is running?
// A: Add to test:
//    console.log(loginPage.constructor.name); // IOSLoginPage or AndroidLoginPage

/**
 * ============================================================================
 * RUNNING TESTS
 * ============================================================================
 */

// Run all tests (web + iOS + Android)
// npm test

// iOS only
// npm run test:ios

// Android only
// npm run test:android

// Specific device
// npm run test:iphone (iPhone 12)
// npm run test:iphone-se (iPhone SE)
// npm run test:pixel (Pixel 5)

// Debug mode
// npm run test -- --debug

// UI mode
// npm run test:ui
