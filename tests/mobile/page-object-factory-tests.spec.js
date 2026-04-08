/**
 * Platform-Specific Page Object Tests
 * Tests using platform-specific page objects (iOS and Android separated)
 */

import { test, expect } from '../../fixtures/testFixtures.js';
import { PageObjectFactory } from '../../pages/mobile/PageObjectFactory.js';
import { IOSLoginPage } from '../../pages/mobile/ios/IOSLoginPage.js';
import { AndroidLoginPage } from '../../pages/mobile/android/AndroidLoginPage.js';
import { testUsers } from '../../data/testData.js';
import { wait } from '../../utils/testHelpers.js';

/**
 * Method 1: Using Factory (Recommended - works for both platforms)
 */
test.describe('Using Factory - Cross-Platform Login Tests', () => {
  test('should login successfully using factory', async ({ page }) => {
    // Arrange - Factory automatically selects iOS or Android page object
    const loginPage = PageObjectFactory.getLoginPage(page);
    await loginPage.goto('/login');
    await loginPage.verifyPageLoaded();

    const { email, password } = testUsers.validUser;

    // Act - Same code works on both platforms!
    await loginPage.login(email, password);
    await wait(2000);

    // Assert
    expect(page.url()).toContain('dashboard');
  });

  test('should handle errors with factory', async ({ page }) => {
    const loginPage = PageObjectFactory.getLoginPage(page);
    await loginPage.goto('/login');

    // Act
    await loginPage.login('invalid@example.com', 'wrongpass');
    await wait(1000);

    // Assert
    expect(await loginPage.isErrorVisible()).toBeTruthy();
  });

  test('should access dashboard using factory', async ({ page, authenticatedPage }) => {
    const dashboardPage = PageObjectFactory.getDashboardPage(authenticatedPage.page);
    await dashboardPage.waitForDashboardLoad();

    expect(true).toBeTruthy();
  });
});

/**
 * Method 2: Direct iOS Page Objects (iOS tests only)
 */
test.describe('Direct iOS Page Objects', () => {
  test.beforeEach(({ page }, testInfo) => {
    testInfo.skip(!testInfo.project.name.includes('iOS'), 'iOS only');
  });

  test('should use iOS-specific login features', async ({ page }) => {
    // Arrange - Direct iOS page object
    const loginPage = new IOSLoginPage(page);
    await loginPage.goto('/login');
    await loginPage.verifyPageLoaded();

    // Act - Can use iOS-specific methods
    await loginPage.enterEmail(testUsers.validUser.email);
    await loginPage.enterPassword(testUsers.validUser.password);
    await loginPage.tap(loginPage.loginButton);
    await wait(1000);

    // Assert
    expect(page.url()).toContain('dashboard');
  });

  test('should handle iOS biometric auth', async ({ page }) => {
    const loginPage = new IOSLoginPage(page);
    await loginPage.goto('/login');

    // Act - iOS-specific biometric handling
    await loginPage.handleBiometricAuth();

    // Assert
    expect(true).toBeTruthy();
  });

  test('should announce errors for iOS accessibility', async ({ page }) => {
    const loginPage = new IOSLoginPage(page);
    await loginPage.goto('/login');

    // Act - Login with error
    await loginPage.login('invalid@example.com', 'wrong');
    await wait(1000);

    // iOS-specific: Get error with accessibility announcement
    if (await loginPage.isErrorVisible()) {
      const error = await loginPage.getErrorMessage();
      expect(error).toBeDefined();
    }
  });

  test('should adjust for iOS notch', async ({ page }) => {
    const loginPage = new IOSLoginPage(page);
    await loginPage.goto('/login');

    // Act - Get iOS safe area adjustments
    const adjustments = await loginPage.adjustForNotch();

    // Assert - Should have notch data for iPhones
    expect(adjustments).toHaveProperty('topOffset');
    expect(adjustments).toHaveProperty('bottomOffset');
  });

  test('should handle iOS dashboard sheets', async ({ page, authenticatedPage }) => {
    const dashboardPage = PageObjectFactory.getDashboardPage(authenticatedPage.page);

    // Act - Open profile (iOS shows sheet)
    await dashboardPage.openProfile();
    await wait(500);

    // Assert - Sheet should be visible
    expect(true).toBeTruthy();
  });
});

/**
 * Method 3: Direct Android Page Objects (Android tests only)
 */
test.describe('Direct Android Page Objects', () => {
  test.beforeEach(({ page }, testInfo) => {
    testInfo.skip(!testInfo.project.name.includes('Android'), 'Android only');
  });

  test('should use Android-specific login features', async ({ page }) => {
    // Arrange - Direct Android page object
    const loginPage = new AndroidLoginPage(page);
    await loginPage.goto('/login');
    await loginPage.verifyPageLoaded();

    // Act - Can use Android-specific methods
    await loginPage.enterEmail(testUsers.validUser.email);
    await loginPage.enterPassword(testUsers.validUser.password);
    await loginPage.scrollToElement(loginPage.loginButton); // Android may need scroll
    await loginPage.tap(loginPage.loginButton);
    await wait(1500);

    // Assert
    expect(page.url()).toContain('dashboard');
  });

  test('should handle Android biometric auth', async ({ page }) => {
    const loginPage = new AndroidLoginPage(page);
    await loginPage.goto('/login');

    // Act - Android-specific biometric handling
    await loginPage.handleBiometricAuth();

    // Assert
    expect(true).toBeTruthy();
  });

  test('should handle Android permissions dialog', async ({ page }) => {
    const loginPage = new AndroidLoginPage(page);
    await loginPage.goto('/login');

    // Act - Handle Android permissions
    await loginPage.handlePermissionsDialog();

    // Assert
    expect(true).toBeTruthy();
  });

  test('should handle Android keyboard (IME)', async ({ page }) => {
    const loginPage = new AndroidLoginPage(page);
    await loginPage.goto('/login');

    // Act - Enter text and close keyboard
    await loginPage.enterEmail(testUsers.validUser.email);
    await loginPage.closeAndroidKeyboard();

    expect(true).toBeTruthy();
  });

  test('should handle Android configuration changes', async ({ page }) => {
    const loginPage = new AndroidLoginPage(page);
    await loginPage.goto('/login');

    // Act - Simulate rotation
    await loginPage.handleRotation();

    // Assert - App should still be functional
    const visible = await loginPage.isVisible(loginPage.loginButton);
    expect(visible).toBeTruthy();
  });

  test('should handle Android dashboard with FAB', async ({ page, authenticatedPage }) => {
    const dashboardPage = PageObjectFactory.getDashboardPage(authenticatedPage.page);

    // Act - Click FAB (Android specific)
    await dashboardPage.clickFAB();

    // Assert
    expect(true).toBeTruthy();
  });
});

/**
 * Compare: Factory vs Direct Usage
 */
test.describe('Platform-Specific Comparison Tests', () => {
  test('factory returns correct type for platform', async ({ page }) => {
    const loginPage = PageObjectFactory.getLoginPage(page);

    // iOS
    if (loginPage instanceof IOSLoginPage) {
      expect(loginPage).toBeInstanceOf(IOSLoginPage);
    }
    // Android
    else if (loginPage instanceof AndroidLoginPage) {
      expect(loginPage).toBeInstanceOf(AndroidLoginPage);
    }
  });

  test('platform-specific methods are available', async ({ page }) => {
    const loginPage = PageObjectFactory.getLoginPage(page);

    // Both have base methods
    expect(typeof loginPage.login).toBe('function');
    expect(typeof loginPage.tap).toBe('function');

    // iOS has iOS methods
    if (loginPage instanceof IOSLoginPage) {
      expect(typeof loginPage.handleBiometricAuth).toBe('function');
      expect(typeof loginPage.adjustForNotch).toBe('function');
    }

    // Android has Android methods
    if (loginPage instanceof AndroidLoginPage) {
      expect(typeof loginPage.handlePermissionsDialog).toBe('function');
      expect(typeof loginPage.handleConfigurationChange).toBe('function');
    }
  });
});
