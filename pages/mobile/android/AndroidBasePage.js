/**
 * Android Base Page
 * Base class specifically for Android with Android-specific patterns
 */

import { MobileBasePage } from '../MobileBasePage.js';

export class AndroidBasePage extends MobileBasePage {
  /**
   * Android-specific: Use test IDs
   */
  constructor(page, baseUrl = '') {
    super(page, baseUrl);
    if (!this.isAndroid) {
      throw new Error('AndroidBasePage should only be used on Android. Use IOSBasePage for iOS.');
    }
  }

  /**
   * Android-specific: Tap outside or press back to dismiss modal
   */
  async dismissModal() {
    // Try to find close button first
    const closeButton = this.page.locator('button[class*="close"]').first();
    if (await closeButton.isVisible()) {
      await this.tap(closeButton);
    } else {
      // Otherwise, use hardware back button
      await this.page.keyboard.press('Backspace');
    }
  }

  /**
   * Android-specific: Use hardware back button
   */
  async goBackAndroid() {
    await this.page.keyboard.press('Backspace');
  }

  /**
   * Android-specific: Handle Android bottom sheet
   */
  async waitForBottomSheet() {
    await this.waitForElement('[role="dialog"]', 5000);
  }

  /**
   * Android-specific: Handle Android system navigation
   */
  async handleSystemNavigation() {
    // Android system back button (hardware)
    await this.page.keyboard.press('Backspace');
  }

  /**
   * Android-specific: Handle IME (Input Method Editor) - Android keyboard
   */
  async closeAndroidKeyboard() {
    await this.page.keyboard.press('Escape');
  }

  /**
   * Android-specific: Handle multi-window mode
   */
  async handleMultiWindowMode() {
    // Simulate multi-window resize
    const viewport = this.page.viewportSize();
    return {
      width: viewport.width,
      height: viewport.height / 2, // Half screen for split mode
    };
  }

  /**
   * Android-specific: Handle configuration changes (orientation, language)
   */
  async fireConfigurationChange() {
    await this.page.evaluate(() => {
      window.dispatchEvent(new Event('orientationchange'));
    });
  }

  /**
   * Android-specific: Handle Material Design patterns
   */
  async waitForMaterialDialog() {
    await this.waitForElement('[role="dialog"]', 5000);
  }

  /**
   * Android-specific: Haptic feedback (vibration)
   */
  async triggerVibration(duration = 50) {
    // In real Android app, would trigger device vibration
    console.log(`Android Vibration: ${duration}ms`);
  }
}
