/**
 * Android Login Page
 * Android-specific login page object using test IDs
 */

import { AndroidBasePage } from './AndroidBasePage.js';

export class AndroidLoginPage extends AndroidBasePage {
  // Android uses test IDs
  emailInput = 'input[data-testid="email_input"]';
  passwordInput = 'input[data-testid="password_input"]';
  loginButton = 'button[data-testid="login_button"]';
  errorMessage = 'div[data-testid="error_message"]';
  rememberMeCheckbox = 'input[data-testid="remember_me"]';

  /**
   * Enter email on Android with Android-specific keyboard
   */
  async enterEmail(email) {
    await this.tap(this.emailInput);
    await this.fillText(this.emailInput, email);
    // Android: Keyboard may stay open, tap elsewhere to close
    await this.page.tap('label'); // Tap on a neutral area
  }

  /**
   * Enter password on Android
   */
  async enterPassword(password) {
    await this.tap(this.passwordInput);
    await this.fillText(this.passwordInput, password);
  }

  /**
   * Android-specific login handling
   */
  async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);

    // Android: Scroll to button if needed (smaller screens)
    await this.scrollToElement(this.loginButton);
    await this.tap(this.loginButton);

    // Handle Android permissions dialog if present
    await this.handlePermissionsDialog();
  }

  /**
   * Android-specific: Check for error
   */
  async isErrorVisible() {
    const element = this.page.locator(this.errorMessage);
    return await element.isVisible();
  }

  /**
   * Android-specific: Get error message (Toast/Snackbar)
   */
  async getErrorMessage() {
    // Android uses Snackbar/Toast for errors
    const snackbar = this.page.locator('[role="status"]');
    const toast = this.page.locator('.android-toast');
    const error = this.page.locator(this.errorMessage);

    if (await snackbar.isVisible()) {
      return await snackbar.textContent();
    }
    if (await toast.isVisible()) {
      return await toast.textContent();
    }
    return await error.textContent();
  }

  /**
   * Android-specific: Verify page loaded
   */
  async verifyPageLoaded() {
    await this.waitForElement(this.loginButton);
  }

  /**
   * Android-specific: Clear form
   */
  async clearForm() {
    await this.clearInput(this.emailInput);
    await this.clearInput(this.passwordInput);
  }

  /**
   * Android-specific: Handle biometric authentication (fingerprint/face)
   */
  async handleBiometricAuth() {
    const biometricPrompt = this.page.locator('[role="dialog"]:text("Biometric")');
    if (await biometricPrompt.isVisible()) {
      // In real Android app, would trigger biometric
      const confirmButton = this.page.locator('button:text("Confirm")');
      if (await confirmButton.isVisible()) {
        await this.tap(confirmButton);
      }
    }
  }

  /**
   * Android-specific: Handle permissions dialog
   */
  async handlePermissionsDialog() {
    const permissionsDialog = this.page.locator('[role="dialog"]:text("Allow")');
    if (await permissionsDialog.isVisible()) {
      const allowButton = this.page.locator('button:text("Allow")');
      if (await allowButton.isVisible()) {
        await this.tap(allowButton);
      }
    }
  }

  /**
   * Android-specific: Handle configuration change (rotation, etc.)
   */
  async handleRotation() {
    await this.fireConfigurationChange();
    // Give app time to reconfigure
    await this.page.waitForTimeout(500);
  }
}
