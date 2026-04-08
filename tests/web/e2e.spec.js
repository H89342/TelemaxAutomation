/**
 * Web E2E Tests - End to End user flow testing
 * Demonstrates complete user workflows
 */

import { test, expect } from '../fixtures/testFixtures.js';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { FormPage } from '../pages/FormPage.js';
import { testUsers, formData } from '../data/testData.js';
import { wait } from '../utils/testHelpers.js';

test.describe('E2E User Workflows', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto('/login');
  });

  test('@smoke should complete full login-dashboard-logout flow', async ({
    page,
  }) => {
    // Step 1: Login
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    await loginPage.waitForLoginSuccess();

    // Step 2: Verify dashboard
    await dashboardPage.waitForDashboardLoad();
    const greeting = await dashboardPage.getUserGreeting();
    expect(greeting).toContain(testUsers.validUser.name);

    // Step 3: Logout
    await dashboardPage.logout();
    expect(page.url()).toContain('/login');
  });

  test('@regression should handle session timeout', async ({ page }) => {
    // Login successfully
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    await loginPage.waitForLoginSuccess();

    // Simulate session timeout
    await page.evaluate(() => {
      localStorage.clear();
    });

    // Try to navigate to dashboard
    await page.goto('/dashboard');

    // Should redirect to login
    expect(page.url()).toContain('/login');
  });
});

test.describe('Web Form Workflows', () => {
  test('should complete contact form submission', async ({ page }) => {
    const formPage = new FormPage(page);

    // Navigate to contact form
    await formPage.goto('/contact');

    // Fill form
    await formPage.fillForm(formData.contactForm);

    // Submit
    await formPage.submitForm();

    // Verify success
    await page.waitForSelector('.success-message', { timeout: 5000 });
    const successText = await page.textContent('.success-message');
    expect(successText).toContain('Thank you');
  });

  test('should validate required fields on contact form', async ({ page }) => {
    const formPage = new FormPage(page);

    // Navigate to form
    await formPage.goto('/contact');

    // Try to submit empty form
    await formPage.submitForm();

    // Verify validation errors appear
    const errors = await page.locator('.field-error').count();
    expect(errors).toBeGreaterThan(0);
  });
});
