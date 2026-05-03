/**
 * Custom Test Fixtures
 * Provides setup and teardown for tests
 */

import { test as base } from '@playwright/test';
import { BasePage } from '../pages/BasePage.js';
import { getEnvironment } from '../config/environment.js';

/**
 * Custom test fixture with common setup
 */
export const test = base.extend({
  /**
   * Base page fixture with common page methods
   */
  basePage: async ({ page }, use) => {
    const environment = getEnvironment();
    const basePage = new BasePage(page, environment.baseUrl);
    await use(basePage);
  },

  /**
   * API context fixture
   */
  apiContext: async ({ context }, use) => {
    const environment = getEnvironment();
    const apiContext = {
      baseUrl: environment.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      async request(method, endpoint, data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
          method,
          headers: this.headers,
        };
        if (data) {
          options.body = JSON.stringify(data);
        }
        const response = await context.request[method.toLowerCase()](url, options);
        return {
          status: response.status(),
          data: await response.json().catch(() => null),
          headers: response.headers(),
        };
      },
      async get(endpoint) {
        return this.request('GET', endpoint);
      },
      async post(endpoint, data) {
        return this.request('POST', endpoint, data);
      },
      async put(endpoint, data) {
        return this.request('PUT', endpoint, data);
      },
      async delete(endpoint) {
        return this.request('DELETE', endpoint);
      },
    };
    await use(apiContext);
  },

  /**
   * Auth fixture - logs in user before test
   */
  authenticatedPage: async ({ page }, use) => {
    const environment = getEnvironment();
    const basePage = new BasePage(page, environment.baseUrl);

    // Navigate to login page (adjust selectors based on your app)
    await page.goto(environment.baseUrl);
    await page.fill('input[name="email"]', environment.username);
    await page.fill('input[name="password"]', environment.password);
    await page.click('button[type="submit"]');

    // Wait for dashboard/home page
    await page.waitForNavigation();

    await use(basePage);
  },

  /**
   * Mobile-specific fixture
   */
  mobileContext: async ({ browser }, use) => {
    const mobileContext = {
      isMobile: true,
      async tap(page, selector) {
        await page.tap(selector);
      },
     async swipe(page, startX, startY, endX, endY) {
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, { steps: 10 });
  await page.mouse.up();
},
      async longPress(page, selector) {
        await page.locator(selector).hover();
        await page.waitForTimeout(1000);
      },
    };
    await use(mobileContext);
  },
});

export { expect } from '@playwright/test';
