/**
 * Mobile Dashboard Page - Shared for iOS and Android
 */

import { MobileBasePage } from './MobileBasePage.js';

export class MobileDashboardPage extends MobileBasePage {
  // Selectors that work for both platforms
  searchLabel = 'label:text("Search")';
  profileButton = 'button[aria-label="Profile"]';
  settingsButton = 'button[aria-label="Settings"]';
  logoutButton = 'button:text("Logout")';
  scrollContainer = '.dashboard-content';

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardLoad() {
    await this.waitForElement(this.profileButton, 10000);
  }

  /**
   * Access profile (handles platform differences)
   */
  async openProfile() {
    await this.performPlatformAction(
      async () => {
        // iOS: tap profile button
        await this.tap(this.profileButton);
      },
      async () => {
        // Android: tap and wait for sheet
        await this.tap(this.profileButton);
        await this.page.waitForTimeout(500);
      }
    );
  }

  /**
   * Open settings
   */
  async openSettings() {
    await this.tap(this.settingsButton);
  }

  /**
   * Logout with platform-specific handling
   */
  async logout() {
    await this.openProfile();
    await this.tap(this.logoutButton);

    if (this.isIOS) {
      // iOS might show confirmation
      const confirmButton = this.page.locator('button:text("Confirm")').first();
      if (await confirmButton.isVisible()) {
        await this.tap('button:text("Confirm")');
      }
    }
  }

  /**
   * Scroll dashboard content
   */
  async scrollDashboard(direction = 'down') {
    if (direction === 'down') {
      await this.swipeUp(150);
    } else if (direction === 'up') {
      await this.swipeDown(150);
    }
  }

  /**
   * Search functionality
   */
  async search(term) {
    await this.tap(this.searchLabel);
    await this.fillText('input[placeholder*="Search"]', term);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Verify dashboard title
   */
  async getDashboardTitle() {
    return await this.getTitle();
  }

  /**
   * Get number of list items (cross-platform)
   */
  async getListItemCount() {
    return await this.page.locator('.list-item').count();
  }
}
