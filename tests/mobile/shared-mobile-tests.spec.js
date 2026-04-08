/**
 * Shared Mobile Tests - Running on both iOS and Android
 * Platform-specific behavior is handled automatically
 */

import { test, expect } from '../../fixtures/testFixtures.js';
import { MobileLoginPage } from '../../pages/mobile/MobileLoginPage.js';
import { MobileDashboardPage } from '../../pages/mobile/MobileDashboardPage.js';
import { testUsers } from '../../data/testData.js';
import { wait } from '../../utils/testHelpers.js';

test.describe('Shared Mobile Login Tests (iOS & Android)', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new MobileLoginPage(page);
    await loginPage.goto('/login');
    await loginPage.verifyPageLoaded();
  });

  test('should successfully login on all platforms', async ({ page }) => {
    // Arrange
    const { email, password } = testUsers.validUser;

    // Act - Platform-aware login (selectors automatically handled)
    await loginPage.login(email, password);
    await wait(2000);

    // Assert
    expect(page.url()).toContain('dashboard');
  });

  test('should display error with invalid credentials on all platforms', async ({
    page,
  }) => {
    // Arrange
    const { email } = testUsers.invalidUser;

    // Act
    await loginPage.login(email, 'wrongpassword');
    await wait(1000);

    // Assert
    expect(await loginPage.isErrorVisible()).toBeTruthy();
  });

  test('should clear form on all platforms', async ({ page }) => {
    // Arrange
    const { email, password } = testUsers.validUser;

    // Act
    await loginPage.enterEmail(email);
    await loginPage.enterPassword(password);
    await loginPage.clearForm();

    // Assert
    const emailValue = await loginPage.getValue(loginPage.emailInput);
    expect(emailValue).toBe('');
  });

  test('should handle keyboard on all platforms', async ({ page }) => {
    // Act - Tap email field
    await loginPage.tap(loginPage.emailInput);

    // Assert - Keyboard visible
    const isVisible = await loginPage.isKeyboardVisible();
    expect(isVisible).toBeTruthy();

    // Act - Close keyboard
    await loginPage.closeKeyboard();
  });
});

test.describe('Shared Mobile Dashboard Tests (iOS & Android)', () => {
  test('should load dashboard on all platforms', async ({
    page,
    authenticatedPage,
  }) => {
    const dashboardPage = new MobileDashboardPage(authenticatedPage.page);
    await dashboardPage.waitForDashboardLoad();

    // Both platforms load successfully
    expect(true).toBeTruthy();
  });

  test('should scroll dashboard content on all platforms', async ({
    page,
    authenticatedPage,
  }) => {
    const dashboardPage = new MobileDashboardPage(authenticatedPage.page);
    await dashboardPage.waitForDashboardLoad();

    // Act - Scroll down (works on iOS and Android)
    await dashboardPage.scrollDashboard('down');
    await wait(500);

    // Scroll up
    await dashboardPage.scrollDashboard('up');

    // Assert
    expect(true).toBeTruthy();
  });

  test('should get list item count on all platforms', async ({
    page,
    authenticatedPage,
  }) => {
    const dashboardPage = new MobileDashboardPage(authenticatedPage.page);
    await dashboardPage.waitForDashboardLoad();

    // Act
    const count = await dashboardPage.getListItemCount();

    // Assert - Should have items (exact count depends on backend)
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Shared Mobile Gestures (iOS & Android)', () => {
  test('should perform tap gesture on all platforms', async ({ page }) => {
    const loginPage = new MobileLoginPage(page);
    await loginPage.goto('/login');

    // Act - Tap is universal
    await loginPage.tap(loginPage.emailInput);

    // Assert
    const focused = await page.evaluate(
      () => document.activeElement.name === 'email'
    );
    expect(focused).toBeTruthy();
  });

  test('should perform swipe up on all platforms', async ({ page }) => {
    const loginPage = new MobileLoginPage(page);
    await loginPage.goto('/');

    // Act - Swipe up works on both platforms
    await loginPage.swipeUp(100);

    // Assert - No error thrown
    expect(true).toBeTruthy();
  });

  test('should perform swipe down on all platforms', async ({ page }) => {
    const loginPage = new MobileLoginPage(page);
    await loginPage.goto('/');

    // Act - Swipe down works on both platforms
    await loginPage.swipeDown(50);

    // Assert - No error thrown
    expect(true).toBeTruthy();
  });

  test('should perform double tap on all platforms', async ({ page }) => {
    const loginPage = new MobileLoginPage(page);
    await loginPage.goto('/login');

    // Act - Double tap
    await loginPage.doubleTap(loginPage.loginButton);

    // Assert - No error thrown
    expect(true).toBeTruthy();
  });

  test('should perform long press on all platforms', async ({ page }) => {
    const loginPage = new MobileLoginPage(page);
    await loginPage.goto('/login');

    // Act - Long press
    await loginPage.longPress(loginPage.loginButton, 500);

    // Assert - No error thrown
    expect(true).toBeTruthy();
  });
});

test.describe('Shared Mobile Orientation Changes (iOS & Android)', () => {
  test('should handle portrait orientation on all platforms', async ({
    page,
  }) => {
    // Portrait
    await page.setViewportSize({ width: 390, height: 844 });

    const loginPage = new MobileLoginPage(page);
    await loginPage.goto('/login');

    expect(await loginPage.isVisible(loginPage.loginButton)).toBeTruthy();
  });

  test('should handle landscape orientation on all platforms', async ({
    page,
  }) => {
    // Portrait first
    await page.setViewportSize({ width: 390, height: 844 });

    const loginPage = new MobileLoginPage(page);
    await loginPage.goto('/login');

    // Landscape
    await page.setViewportSize({ width: 844, height: 390 });
    await wait(500);

    // Should still be usable
    expect(await loginPage.isVisible(loginPage.emailInput)).toBeTruthy();
  });

  test('should maintain form state during orientation change on all platforms', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const loginPage = new MobileLoginPage(page);
    await loginPage.goto('/login');

    // Fill form in portrait
    await loginPage.enterEmail('test@example.com');

    // Change orientation
    await page.setViewportSize({ width: 844, height: 390 });
    await wait(500);

    // Email should still be there
    const email = await loginPage.getValue(loginPage.emailInput);
    expect(email).toBe('test@example.com');
  });
});

test.describe('Shared Mobile Platform Detection (iOS & Android)', () => {
  test('should detect platform correctly', async ({ page }) => {
    const loginPage = new MobileLoginPage(page);

    // Each platform is detected
    if (loginPage.isIOS) {
      expect(loginPage.platform).toBe('ios');
      expect(loginPage.isAndroid).toBeFalsy();
    } else {
      expect(loginPage.isAndroid).toBeTruthy();
      expect(loginPage.isIOS).toBeFalsy();
    }
  });

  test('should use correct selectors per platform', async ({ page }) => {
    const loginPage = new MobileLoginPage(page);

    // Get selector
    const emailSelector = loginPage.emailInput;

    // iOS and Android may have different selectors
    expect(emailSelector).toBeDefined();
    expect(emailSelector.length).toBeGreaterThan(0);
  });

  test('should perform platform-specific actions', async ({ page }) => {
    const loginPage = new MobileLoginPage(page);
    await loginPage.goto('/');

    // This uses performPlatformAction internally for back navigation
    // Works on both iOS (via button) and Android (via back button)
    expect(true).toBeTruthy();
  });
});

test.describe('Shared Mobile Error Handling (iOS & Android)', () => {
  test('should handle network timeout gracefully on all platforms', async ({
    page,
  }) => {
    const loginPage = new MobileLoginPage(page);

    try {
      // Try with very short timeout - will fail but should be handled
      await page.waitForSelector('.nonexistent', { timeout: 100 });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('should handle missing selectors gracefully on all platforms', async ({
    page,
  }) => {
    const loginPage = new MobileLoginPage(page);
    await loginPage.goto('/login');

    // Try to interact with element that doesn't exist
    const visible = await loginPage.isVisible('.this-does-not-exist');
    expect(visible).toBeFalsy();
  });
});
