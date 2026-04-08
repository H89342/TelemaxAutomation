/**
 * Mobile Page Object Factory
 * Automatically selects iOS or Android page objects based on platform
 */

import { IOSLoginPage } from './ios/IOSLoginPage.js';
import { AndroidLoginPage } from './android/AndroidLoginPage.js';
import { IOSDashboardPage } from './ios/IOSDashboardPage.js';
import { AndroidDashboardPage } from './android/AndroidDashboardPage.js';
import { isIOS, isAndroid } from '../../utils/mobile/platformDetection.js';

/**
 * Page Object Factory
 * Returns platform-specific page object automatically
 */
export class PageObjectFactory {
  /**
   * Get Login Page for current platform
   * @param {import('@playwright/test').Page} page - Playwright page
   * @param {string} baseUrl - Base URL
   * @returns {IOSLoginPage | AndroidLoginPage} Platform-specific login page
   */
  static getLoginPage(page, baseUrl = '') {
    if (isIOS(page)) {
      return new IOSLoginPage(page, baseUrl);
    } else if (isAndroid(page)) {
      return new AndroidLoginPage(page, baseUrl);
    }
    throw new Error('Unknown platform');
  }

  /**
   * Get Dashboard Page for current platform
   * @param {import('@playwright/test').Page} page - Playwright page
   * @param {string} baseUrl - Base URL
   * @returns {IOSDashboardPage | AndroidDashboardPage} Platform-specific dashboard page
   */
  static getDashboardPage(page, baseUrl = '') {
    if (isIOS(page)) {
      return new IOSDashboardPage(page, baseUrl);
    } else if (isAndroid(page)) {
      return new AndroidDashboardPage(page, baseUrl);
    }
    throw new Error('Unknown platform');
  }

  /**
   * Create any page object for platform
   * @param {import('@playwright/test').Page} page - Playwright page
   * @param {string} pageType - Type of page ('login', 'dashboard', etc.)
   * @param {string} baseUrl - Base URL
   * @returns {IOSBasePage | AndroidBasePage} Platform-specific page object
   */
  static getPage(page, pageType, baseUrl = '') {
    const pageTypeMap = {
      login: { ios: IOSLoginPage, android: AndroidLoginPage },
      dashboard: { ios: IOSDashboardPage, android: AndroidDashboardPage },
    };

    const PageClass = isIOS(page)
      ? pageTypeMap[pageType]?.ios
      : pageTypeMap[pageType]?.android;

    if (!PageClass) {
      throw new Error(`Unknown page type: ${pageType}`);
    }

    return new PageClass(page, baseUrl);
  }
}

// Convenience exports
export { IOSLoginPage, AndroidLoginPage, IOSDashboardPage, AndroidDashboardPage };
export { IOSBasePage } from './ios/IOSBasePage.js';
export { AndroidBasePage } from './android/AndroidBasePage.js';
