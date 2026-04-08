/**
 * Android Dashboard Page
 * Android-specific dashboard page object
 */

import { AndroidBasePage } from './AndroidBasePage.js';

export class AndroidDashboardPage extends AndroidBasePage {
  profileButton = 'button[data-testid="profile_button"]';
  settingsButton = 'button[data-testid="settings_button"]';
  logoutButton = 'button[data-testid="logout_button"]';
  scrollContent = '.dashboard-content';
  listItems = 'div[data-testid="list_item"]';
  fab = 'button[data-testid="fab"]'; // Floating Action Button

  /**
   * Wait for Android dashboard to load
   */
  async waitForDashboardLoad() {
    await this.waitForElement(this.profileButton, 10000);
  }

  /**
   * Android-specific: Open profile with haptic feedback
   */
  async openProfile() {
    await this.triggerVibration(50);
    await this.tap(this.profileButton);
  }

  /**
   * Android-specific: Open settings
   */
  async openSettings() {
    await this.tap(this.settingsButton);
  }

  /**
   * Android-specific: Logout with Material design confirmation
   */
  async logout() {
    await this.openProfile();
    await this.tap(this.logoutButton);

    // Android shows Material Dialog
    const confirmButton = this.page.locator('button:text("Confirm")');
    if (await confirmButton.isVisible()) {
      await this.triggerVibration(50);
      await this.tap(confirmButton);
    }
  }

  /**
   * Android-specific: Scroll with momentum
   */
  async scrollDashboard(direction = 'down') {
    if (direction === 'down') {
      await this.swipeUp(200);
    } else {
      await this.swipeDown(200);
    }
  }

  /**
   * Android-specific: Swipe to refresh gesture
   */
  async swipeToRefresh() {
    const { height, width } = this.page.viewportSize();
    // Refresh gesture from top
    await this.page.touchscreen.tap(width / 2, 50);
    await this.page.touchscreen.move(width / 2, 200);
    await this.page.touchscreen.release();
  }

  /**
   * Android-specific: FAB (Floating Action Button) click
   */
  async clickFAB() {
    const fabButton = this.page.locator(this.fab);
    if (await fabButton.isVisible()) {
      await this.tap(this.fab);
      // Vibration feedback on FAB press
      await this.triggerVibration(100);
    }
  }

  /**
   * Get list item count
   */
  async getListItemCount() {
    return await this.page.locator(this.listItems).count();
  }

  /**
   * Android-specific: Handle back navigation
   */
  async goBackAndroidNative() {
    await this.goBackAndroid();
  }

  /**
   * Android-specific: Handle configuration changes
   */
  async handleConfigurationChange() {
    await this.fireConfigurationChange();
    await this.page.waitForTimeout(500);
  }
}
