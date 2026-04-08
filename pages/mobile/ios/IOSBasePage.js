/**
 * iOS Base Page
 * Base class specifically for iOS with iOS-specific patterns
 */

import { MobileBasePage } from '../MobileBasePage.js';

export class IOSBasePage extends MobileBasePage {
  /**
   * iOS-specific: Use accessibility IDs
   */
  constructor(page, baseUrl = '') {
    super(page, baseUrl);
    if (!this.isIOS) {
      throw new Error('IOSBasePage should only be used on iOS. Use AndroidBasePage for Android.');
    }
  }

  /**
   * iOS-specific: Handle iOS modal dismissal (swipe down)
   */
  async dismissModal() {
    await this.swipeDown(150);
  }

  /**
   * iOS-specific: Access iOS navigation using back button
   */
  async goBackIOS() {
    await this.tap('button[aria-label="Back"]');
  }

  /**
   * iOS-specific: Handle iOS sheet presentation
   */
  async waitForSheet() {
    await this.waitForElement('.ios-sheet', 5000);
  }

  /**
   * iOS-specific: Safe area handling for notched iPhones
   */
  async adjustForNotch() {
    const insets = await this.getSafeAreaInsets();
    return {
      topOffset: insets.top,
      bottomOffset: insets.bottom,
    };
  }

  /**
   * iOS-specific: Handle accessibility focus
   */
  async setAccessibilityFocus(selector) {
    await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      element?.focus();
    }, selector);
  }

  /**
   * iOS-specific: VoiceOver simulation
   */
  async announceForAccessibility(text) {
    await this.page.evaluate((announcement) => {
      const ariaLive = document.createElement('div');
      ariaLive.setAttribute('role', 'status');
      ariaLive.setAttribute('aria-live', 'polite');
      ariaLive.textContent = announcement;
      document.body.appendChild(ariaLive);
      setTimeout(() => ariaLive.remove(), 1000);
    }, text);
  }

  /**
   * iOS-specific: Handle iOS haptic feedback (visual only in tests)
   */
  async triggerHaptic(style = 'success') {
    // In real iOS app, this would trigger device haptics
    console.log(`iOS Haptic: ${style}`);
  }
}
