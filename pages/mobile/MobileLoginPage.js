/**
 * Mobile Login Page - Shared for iOS and Android
 * Platform-specific selectors handled internally
 */

import { MobileBasePage } from '../MobileBasePage.js';

export class MobileLoginPage extends MobileBasePage {
  // iOS-specific selectors
  iosEmailInput = 'input[name="email"]';
  iosPasswordInput = 'input[name="password"]';
  iosLoginButton = 'button:text("Login")';
  iosErrorMessage = '.error-ios';
  iosRememberMeCheckbox = 'input[name="rememberMe"]';

  // Android-specific selectors (can use Android-specific attributes)
  androidEmailInput = 'input[name="email"]';
  androidPasswordInput = 'input[name="password"]';
  androidLoginButton = 'button:text("Sign in")'; // Different text for Android
  androidErrorMessage = '.error-android';
  androidRememberMeCheckbox = 'input[name="rememberMe"]';

  /**
   * Get email input selector for platform
   */
  get emailInput() {
    return this.getPlatformSelector(this.iosEmailInput, this.androidEmailInput);
  }

  /**
   * Get password input selector for platform
   */
  get passwordInput() {
    return this.getPlatformSelector(this.iosPasswordInput, this.androidPasswordInput);
  }

  /**
   * Get login button selector for platform
   */
  get loginButton() {
    return this.getPlatformSelector(this.iosLoginButton, this.androidLoginButton);
  }

  /**
   * Get error message selector for platform
   */
  get errorMessage() {
    return this.getPlatformSelector(this.iosErrorMessage, this.androidErrorMessage);
  }

  /**
   * Enter email
   * @param {string} email - Email address
   */
  async enterEmail(email) {
    await this.tap(this.emailInput);
    await this.fillText(this.emailInput, email);
  }

  /**
   * Enter password
   * @param {string} password - Password
   */
  async enterPassword(password) {
    await this.tap(this.passwordInput);
    await this.fillText(this.passwordInput, password);
  }

  /**
   * Click login button - handles platform differences
   */
  async clickLoginButton() {
    await this.performPlatformAction(
      async () => {
        // iOS: tap button
        await this.tap(this.iosLoginButton);
      },
      async () => {
        // Android: tap button or scroll if needed
        await this.scrollToElement(this.androidLoginButton);
        await this.tap(this.androidLoginButton);
      }
    );
  }

  /**
   * Perform login
   * @param {string} email - Email
   * @param {string} password - Password
   */
  async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Check if error is visible
   */
  async isErrorVisible() {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Get error message
   */
  async getErrorMessage() {
    return await this.getText(this.errorMessage);
  }

  /**
   * Verify login page loaded
   */
  async verifyPageLoaded() {
    await this.waitForElement(this.loginButton);
  }

  /**
   * Toggle remember me checkbox
   */
  async toggleRememberMe() {
    const selector = this.getPlatformSelector(
      this.iosRememberMeCheckbox,
      this.androidRememberMeCheckbox
    );
    await this.tap(selector);
  }

  /**
   * Clear login form
   */
  async clearForm() {
    await this.clearInput(this.emailInput);
    await this.clearInput(this.passwordInput);
  }
}
