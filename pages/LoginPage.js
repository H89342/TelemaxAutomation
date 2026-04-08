/**
 * Login Page Object
 * Handles all login-related interactions
 */

import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  // Selectors
  emailInput = 'input[name="email"]';
  passwordInput = 'input[name="password"]';
  loginButton = 'button[type="submit"]';
  errorMessage = '.error-message';
  rememberMeCheckbox = 'input[name="rememberMe"]';
  forgotPasswordLink = 'a[href="/forgot-password"]';

  /**
   * Enter email
   * @param {string} email - Email address
   */
  async enterEmail(email) {
    await this.fillText(this.emailInput, email);
  }

  /**
   * Enter password
   * @param {string} password - Password
   */
  async enterPassword(password) {
    await this.fillText(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLoginButton() {
    await this.click(this.loginButton);
  }

  /**
   * Perform login action
   * @param {string} email - Email address
   * @param {string} password - Password
   */
  async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Check if login is successful by waiting for navigation
   */
  async waitForLoginSuccess() {
    await this.waitForNavigation();
  }

  /**
   * Get error message
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error message is visible
   * @returns {Promise<boolean>} True if error is visible
   */
  async isErrorVisible() {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Toggle remember me checkbox
   */
  async toggleRememberMe() {
    await this.check(this.rememberMeCheckbox);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Verify login page loaded
   */
  async verifyPageLoaded() {
    await this.waitForElement(this.loginButton);
  }
}
