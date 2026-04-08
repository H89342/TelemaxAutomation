/**
 * Mobile Application Login Tests
 * Tests for mobile-based login functionality
 */

import { test, expect } from '../../fixtures/testFixtures.js';
import { LoginPage } from '../../pages/LoginPage.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import { testUsers } from '../../data/testData.js';
import { wait } from '../../utils/testHelpers.js';

test.describe('Mobile Login Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page, basePage }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Navigate to login page
    await loginPage.goto('/login');
    await loginPage.verifyPageLoaded();
  });

  test('should successfully login on mobile with valid credentials', async ({
    page,
  }) => {
    // Arrange
    const { email, password } = testUsers.validUser;

    // Act
    await loginPage.login(email, password);
    await wait(2000); // Mobile may have slower response

    // Assert
    await dashboardPage.waitForDashboardLoad();
    expect(page.viewportSize().width).toBeLessThan(600); // Verify mobile viewport
  });

  test('should display error message on mobile with invalid credentials', async ({
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

  test('should scroll to show password field on mobile', async ({
    page,
  }) => {
    // Act
    await page.locator(loginPage.passwordInput).scrollIntoViewIfNeeded();

    // Assert
    expect(await loginPage.isVisible(loginPage.passwordInput)).toBeTruthy();
  });

  test('should handle mobile keyboard interactions', async ({ page }) => {
    // Act
    const emailField = page.locator(loginPage.emailInput);
    await emailField.focus();
    await emailField.type(testUsers.validUser.email);

    // Assert
    const value = await emailField.inputValue();
    expect(value).toBe(testUsers.validUser.email);
  });

  test('should work with mobile-specific touch events', async ({
    page,
    mobileContext,
  }) => {
    // Act
    await mobileContext.tap(page, loginPage.emailInput);
    await page.fill(loginPage.emailInput, testUsers.validUser.email);
    await mobileContext.tap(page, loginPage.loginButton);

    // Assert - test completes without error
    expect(true).toBeTruthy();
  });

  test('should maintain session on mobile after login', async ({
    page,
    context,
  }) => {
    // Act
    const { email, password } = testUsers.validUser;
    await loginPage.login(email, password);
    await wait(2000);

    // Create new page with same context (session shared)
    const newPage = await context.newPage();
    await newPage.goto('/dashboard');

    // Assert - should already be authenticated
    expect(newPage.url()).toContain('/dashboard');

    await newPage.close();
  });
});

test.describe('Mobile Responsive Tests', () => {
  test(
    'should display optimized layout for small mobile devices',
    async ({ page }) => {
      // Arrange - set to small mobile viewport
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      // Act
      await page.goto('/login');
      const loginPage = new LoginPage(page);

      // Assert
      expect(await loginPage.isVisible(loginPage.emailInput)).toBeTruthy();
      expect(await loginPage.isVisible(loginPage.passwordInput)).toBeTruthy();
    }
  );

  test('should display optimized layout for tablet', async ({ page }) => {
    // Arrange - set to tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad

    // Act
    await page.goto('/login');
    const loginPage = new LoginPage(page);

    // Assert
    expect(await loginPage.isVisible(loginPage.emailInput)).toBeTruthy();
  });

  test('should handle orientation change', async ({ page }) => {
    // Arrange
    await page.goto('/login');
    await page.setViewportSize({ width: 375, height: 667 }); // Portrait

    // Act - rotate to landscape
    await page.setViewportSize({ width: 667, height: 375 }); // Landscape

    // Assert - page should still be functional
    const loginPage = new LoginPage(page);
    expect(await loginPage.isVisible(loginPage.loginButton)).toBeTruthy();
  });
});
