/**
 * Mobile API + UI Integration Tests
 * Tests combining API calls with mobile UI verification
 */

import { test, expect } from '../../fixtures/testFixtures.js';
import { LoginPage } from '../../pages/LoginPage.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import { testUsers, apiTestData } from '../../data/testData.js';
import { wait } from '../../utils/testHelpers.js';
import { createAuthHeader } from '../../utils/apiHelpers.js';

test.describe('Mobile API + UI Tests', () => {
  let loginPage;
  let dashboardPage;
  let authToken;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto('/login');
  });

  test('should sync data from API after login on mobile', async ({
    page,
    apiContext,
  }) => {
    // Login via UI
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    await wait(2000);

    // Fetch user data from API
    const userResponse = await apiContext.get('/api/user/profile');
    expect(userResponse.status).toBe(200);

    // Verify API data
    const userData = userResponse.data;
    expect(userData.email).toBe(testUsers.validUser.email);

    // Verify UI reflects API data
    const greeting = await dashboardPage.getUserGreeting();
    expect(greeting).toContain(userData.name);
  });

  test('should create and display item on mobile after API creation', async ({
    page,
    apiContext,
  }) => {
    // Create item via API
    const createResponse = await apiContext.post(
      '/api/items',
      apiTestData.createUserPayload
    );
    expect(createResponse.status).toBe(201);
    const itemId = createResponse.data.id;

    // Navigate to items list on mobile
    await page.goto('/items');
    await wait(1000);

    // Verify item appears in UI
    const itemText = await page.locator(`[data-item-id="${itemId}"]`).textContent();
    expect(itemText).toContain(apiTestData.createUserPayload.name);
  });

  test('should handle mobile network retry on failed API call', async ({
    page,
    apiContext,
  }) => {
    // Simulate network error then success
    let attempts = 0;
    const makeRequest = async () => {
      attempts++;
      if (attempts === 1) {
        // First attempt fails
        throw new Error('Network error');
      }
      // Second attempt succeeds
      return await apiContext.get('/api/items');
    };

    try {
      await makeRequest();
    } catch (error) {
      // Retry
      const response = await makeRequest();
      expect(response.status).toBe(200);
    }
  });
});

test.describe('Mobile Performance Tests', () => {
  test('should load dashboard within acceptable time on mobile', async ({
    page,
    authenticatedPage,
  }) => {
    const startTime = Date.now();

    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle'); // Wait for network calls

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle slow network on mobile gracefully', async ({ page }) => {
    // Simulate SLOW_3G network
    await page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 500);
    });

    await page.goto('/');

    // Page should still be interactive
    const buttons = await page.locator('button').count();
    expect(buttons).toBeGreaterThan(0);
  });
});
