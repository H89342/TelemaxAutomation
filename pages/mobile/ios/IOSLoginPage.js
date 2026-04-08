/**
 * iOS Login Page
 * iOS-specific login page object using accessibility IDs
 */

import { IOSBasePage } from './IOSBasePage.js';

export class IOSLoginPage extends IOSBasePage {
  // iOS uses accessibility IDs
  emailInput = 'input[data-accessibility-id="emailInput"]';
  passwordInput = 'input[data-accessibility-id="passwordInput"]';
  loginButton = 'button[data-accessibility-id="loginButton"]';
  errorMessage = 'text[data-accessibility-id="errorMessage"]';
  rememberMeCheckbox = 'input[data-accessibility-id="rememberMe"]';

  /**
   * Enter email on iOS with iOS-specific keyboard
   */
  async enterEmail(email) {
    await this.tap(this.emailInput);
    await this.fillText(this.emailInput, email);
    // iOS: close keyboard by tapping done button
    const doneButton = this.page.locator('button:has-text("Done")');
    if (await doneButton.isVisible()) {
      await this.tap(doneButton);
    }
  }

  /**
   * Enter password on iOS
   */
  async enterPassword(password) {
    await this.tap(this.passwordInput);
    await this.fillText(this.passwordInput, password);
  }

  /**
   * iOS-specific login - handles iOS modal if present
   */
  async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.tap(this.loginButton);

    // Wait for potential iOS modal/sheet
    try {
      await this.waitForSheet();
      // Dismiss any sheet that appeared
      await this.dismissModal();
    } catch (e) {
      // No sheet, continue
    }
  }

  /**
   * iOS-specific: Check for error using accessibility
   */
  async isErrorVisible() {
    const element = this.page.locator(this.errorMessage);
    return await element.isVisible();
  }

  /**
   * iOS-specific: Get error with accessibility awareness
   */
  async getErrorMessage() {
    const element = this.page.locator(this.errorMessage);
    const text = await element.textContent();

    // iOS: Announce error for accessibility
    if (text) {
      await this.announceForAccessibility(`Error: ${text}`);
    }

    return text;
  }

  /**
   * iOS-specific: Verify page loaded
   */
  async verifyPageLoaded() {
    await this.waitForElement(this.loginButton);

    // iOS: Set accessibility focus to first interactive element
    await this.setAccessibilityFocus(this.emailInput);
  }

  /**
   * iOS-specific: Clear form with accessibility
   */
  async clearForm() {
    await this.clearInput(this.emailInput);
    await this.clearInput(this.passwordInput);
    await this.announceForAccessibility('Form cleared');
  }

  /**
   * iOS-specific: Handle Face ID prompt (simulated)
   */
  async handleBiometricAuth() {
    const biometricButton = this.page.locator('button:text("Use Face ID")');
    if (await biometricButton.isVisible()) {
      await this.tap(biometricButton);
    }
  }
}
