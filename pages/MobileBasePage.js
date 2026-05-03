/**
 * Mobile Base Page - Shared for iOS and Android
 * Extends BasePage with platform-specific handling
 */

import { BasePage } from '../BasePage.js';
import {
  getPlatform,
  isIOS,
  isAndroid,
  getPlatformSelector,
  PLATFORMS,
} from '../utils/mobile/platformDetection.js';

export class MobileBasePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page
   * @param {string} baseUrl - Base URL
   */
  constructor(page, baseUrl = '') {
    super(page, baseUrl);
    this.platform = getPlatform(page);
    this.isIOS = isIOS(page);
    this.isAndroid = isAndroid(page);
  }

  /**
   * Tap element (mobile-specific)
   * @param {string} selector - CSS selector
   */
  async tap(selector) {
    await this.page.tap(selector);
  }

  /**
   * Long press element
   * @param {string} selector - CSS selector
   * @param {number} duration - Duration in ms
   */
  async longPress(selector, duration = 1000) {
    const element = this.page.locator(selector);
    const box = await element.boundingBox();

    if (!box) throw new Error(`Element not found: ${selector}`);

    await this.page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await this.page.waitForTimeout(duration);
  }

  /**
   * Swipe gesture
   * @param {number} startX - Start X coordinate
   * @param {number} startY - Start Y coordinate
   * @param {number} endX - End X coordinate
   * @param {number} endY - End Y coordinate
   * @param {number} duration - Duration in ms
   */
  async swipe(startX, startY, endX, endY, duration = 300) {
   await this.page.mouse.move(startX, startY);
await this.page.mouse.down();
await this.page.mouse.move(endX, endY, { steps: 10 });
await this.page.mouse.up();
  }

  /**
   * Swipe up
   * @param {number} distance - Distance to swipe (default 100)
   */
  async swipeUp(distance = 100) {
    const { height } = this.page.viewportSize();
    const startY = height * 0.8;
    const endY = startY - distance;
    const centerX = this.page.viewportSize().width / 2;

    await this.swipe(centerX, startY, centerX, endY);
  }

  /**
   * Swipe down
   * @param {number} distance - Distance to swipe (default 100)
   */
  async swipeDown(distance = 100) {
    const { height } = this.page.viewportSize();
    const startY = height * 0.2;
    const endY = startY + distance;
    const centerX = this.page.viewportSize().width / 2;

    await this.swipe(centerX, startY, centerX, endY);
  }

  /**
   * Swipe left
   * @param {number} distance - Distance to swipe (default 100)
   */
  async swipeLeft(distance = 100) {
    const { width, height } = this.page.viewportSize();
    const startX = width * 0.8;
    const endX = startX - distance;
    const centerY = height / 2;

    await this.swipe(startX, centerY, endX, centerY);
  }

  /**
   * Swipe right
   * @param {number} distance - Distance to swipe (default 100)
   */
  async swipeRight(distance = 100) {
    const { width, height } = this.page.viewportSize();
    const startX = width * 0.2;
    const endX = startX + distance;
    const centerY = height / 2;

    await this.swipe(startX, centerY, endX, centerY);
  }

  /**
   * Double tap element
   * @param {string} selector - CSS selector
   */
  async doubleTap(selector) {
    const element = this.page.locator(selector);
    const box = await element.boundingBox();

    if (!box) throw new Error(`Element not found: ${selector}`);

    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    await this.page.touchscreen.tap(x, y);
    await this.page.touchscreen.tap(x, y);
  }

  /**
   * Pinch zoom
   * @param {number} scale - Zoom scale (1.0 = original, 2.0 = double)
   */
  async pinchZoom(scale) {
    // TODO: Implement pinch zoom
    // This requires evaluating JavaScript or using device-specific methods
    console.warn('Pinch zoom not yet implemented');
  }

  /**
   * Scroll to element - mobile version
   * @param {string} selector - CSS selector
   */
  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Get platform-specific selector
   * @param {string} iosSelector - iOS selector
   * @param {string} androidSelector - Android selector
   * @returns {string} Platform-specific selector
   */
  getPlatformSelector(iosSelector, androidSelector) {
    return this.isIOS ? iosSelector : androidSelector;
  }

  /**
   * Perform platform-specific action
   * @param {Function} iosAction - iOS action function
   * @param {Function} androidAction - Android action function
   */
  async performPlatformAction(iosAction, androidAction) {
    if (this.isIOS) {
      return await iosAction();
    } else {
      return await androidAction();
    }
  }

  /**
   * Wait for platform overlay (iOS sheet / Android bottom sheet)
   * @param {number} timeout - Timeout in ms
   */
  async waitForModal(timeout = 5000) {
    if (this.isIOS) {
      // Wait for iOS modal
      await this.page.waitForSelector('.modal-overlay', { timeout });
    } else {
      // Wait for Android bottom sheet
      await this.page.waitForSelector('[role="dialog"]', { timeout });
    }
  }

  /**
   * Dismiss modal based on platform
   */
  async dismissModal() {
    if (this.isIOS) {
      // iOS: swipe down or tap close button
      await this.tap('button[aria-label="Close"]').catch(() => this.swipeDown());
    } else {
      // Android: tap back button or outside modal
      await this.tap('button[class*="close"]').catch(() => this.page.keyboard.press('Escape'));
    }
  }

  /**
   * Handle platform back navigation
   */
  async goBack() {
    if (this.isIOS) {
      // iOS: tap back button
      await this.tap('button[aria-label="Back"]');
    } else {
      // Android: press hardware back button
      await this.page.keyboard.press('Backspace');
    }
  }

  /**
   * Check keyboard visibility
   * @returns {Promise<boolean>} True if keyboard visible
   */
  async isKeyboardVisible() {
    const initial = this.page.viewportSize().height;
    await this.page.waitForTimeout(100);
    const current = this.page.viewportSize().height;
    return current < initial;
  }

  /**
   * Close keyboard
   */
  async closeKeyboard() {
    if (this.isIOS) {
      await this.page.keyboard.press('Escape');
    } else {
      await this.page.keyboard.press('Escape');
    }
  }

  /**
   * Get safe area insets (iOS safe area)
   * @returns {Promise<object>} Safe area insets
   */
  async getSafeAreaInsets() {
    if (this.isIOS) {
      return await this.page.evaluate(() => {
        const style = window.getComputedStyle(document.documentElement);
        return {
          top: parseFloat(style.getPropertyValue('--safe-area-inset-top')) || 0,
          bottom: parseFloat(style.getPropertyValue('--safe-area-inset-bottom')) || 0,
          left: parseFloat(style.getPropertyValue('--safe-area-inset-left')) || 0,
          right: parseFloat(style.getPropertyValue('--safe-area-inset-right')) || 0,
        };
      });
    }
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  /**
   * Take screenshot with platform identifier
   * @param {string} filename - Screenshot filename
   */
  async takeScreenshot(filename) {
    const platformName = this.isIOS ? 'ios' : 'android';
    const screenshotName = `${platformName}-${filename}`;
    await super.takeScreenshot(screenshotName);
  }
}
