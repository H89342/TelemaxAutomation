/**
 * iOS Dashboard Page
 * iOS-specific dashboard page object
 */

import { IOSBasePage } from './IOSBasePage.js';

export class IOSDashboardPage extends IOSBasePage {
  profileButton = 'button[data-accessibility-id="profileButton"]';
  settingsButton = 'button[data-accessibility-id="settingsButton"]';
  logoutButton = 'button[data-accessibility-id="logoutButton"]';
  scrollContent = '.dashboard-content';
  listItems = 'div[data-accessibility-id="listItem"]';

  /**
   * Wait for iOS dashboard to load
   */
  async waitForDashboardLoad() {
    await this.waitForElement(this.profileButton, 10000);
  }

  /**
   * iOS-specific: Open profile with haptic feedback
   */
  async openProfile() {
    await this.triggerHaptic('light');
    await this.tap(this.profileButton);
    await this.waitForSheet(); // iOS uses sheets
  }

  /**
   * iOS-specific: Open settings
   */
  async openSettings() {
    await this.triggerHaptic('light');
    await this.tap(this.settingsButton);
  }

  /**
   * iOS-specific: Logout with confirmation sheet
   */
  async logout() {
    await this.openProfile();
    await this.tap(this.logoutButton);

    // iOS shows confirmation sheet
    const confirmButton = this.page.locator('button:text("Confirm")');
    if (await confirmButton.isVisible()) {
      await this.triggerHaptic('success');
      await this.tap(confirmButton);
    }
  }

  /**
   * iOS-specific: Scroll with natural deceleration
   */
  async scrollDashboard(direction = 'down') {
    if (direction === 'down') {
      await this.swipeUp(200); // Swipe up = scroll down
    } else {
      await this.swipeDown(200);
    }
    // iOS momentum scrolling simulation
    await this.page.waitForTimeout(300);
  }

  /**
   * iOS-specific: Pull to refresh gesture
   */
  async pullToRefresh() {
    const { height } = this.page.viewportSize();
    // Pull gesture from top
    await this.page.touchscreen.tap(200, 50);
    await this.page.touchscreen.move(200, 150);
    await this.page.touchscreen.release();
  }

  /**
   * Get list item count
   */
  async getListItemCount() {
    return await this.page.locator(this.listItems).count();
  }

  /**
   * iOS-specific: Safe area aware layout
   */
  async adjustLayoutForSafeArea() {
    const insets = await this.getSafeAreaInsets();
    console.log('iOS Safe Area Insets:', insets);
    return insets;
  }
}
