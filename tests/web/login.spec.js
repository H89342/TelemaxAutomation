/**
 * Web Application Login Tests
 * Tests for web-based login functionality
 */

import { test, expect } from '../fixtures/testFixtures.js';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { testUsers } from '../data/testData.js';

test.describe('Web Login Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page, basePage }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Navigate to login page
    await loginPage.goto('/login');
    await loginPage.verifyPageLoaded();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Arrange - using test data
    const { email, password } = testUsers.validUser;

    // Act - perform login
    await loginPage.login(email, password);
    await loginPage.waitForLoginSuccess();

    // Assert - verify dashboard loads
    await dashboardPage.waitForDashboardLoad();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should display error message with invalid credentials', async ({
    page,
  }) => {
    // Arrange
    const { email } = testUsers.invalidUser;
    const invalidPassword = 'wrongpassword';

    // Act
    await loginPage.login(email, invalidPassword);

    // Assert
    expect(await loginPage.isErrorVisible()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
  });

  test('should validate email field is required', async ({ page }) => {
    // Act - try to login without email
    await loginPage.enterPassword(testUsers.validUser.password);
    await loginPage.clickLoginButton();

    // Assert
    expect(await loginPage.isErrorVisible()).toBeTruthy();
  });

  test('should validate password field is required', async ({ page }) => {
    // Act - try to login without password
    await loginPage.enterEmail(testUsers.validUser.email);
    await loginPage.clickLoginButton();

    // Assert
    expect(await loginPage.isErrorVisible()).toBeTruthy();
  });

  test('should remain on login page after failed login', async ({ page }) => {
    // Act
    await loginPage.login(testUsers.invalidUser.email, 'wrongpass');

    // Assert
    expect(page.url()).toContain('/login');
  });
});

test.describe('Web Dashboard Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    dashboardPage = new DashboardPage(authenticatedPage.page);
    await dashboardPage.waitForDashboardLoad();
  });

  test('should display user greeting on dashboard', async ({
    authenticatedPage,
  }) => {
    // Act
    const greeting = await dashboardPage.getUserGreeting();

    // Assert
    expect(greeting).toContain(testUsers.validUser.name);
  });

  test('should successfully logout', async ({ authenticatedPage }) => {
    // Act
    await dashboardPage.logout();

    // Assert
    expect(authenticatedPage.page.url()).toContain('/login');
  });

  test('should display navbar on dashboard', async ({ authenticatedPage }) => {
    // Assert
    const isNavbarVisible = await dashboardPage.isNavbarVisible();
    expect(isNavbarVisible).toBeTruthy();
  });
});
