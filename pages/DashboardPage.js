/**
 * Dashboard Page Object
 * Handles dashboard page interactions
 */

import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {
  // Selectors
  dashboardTitle = 'h1:has-text("Dashboard")';
  userGreeting = '.user-greeting';
  logoutButton = 'button[aria-label="Logout"]';
  userMenu = '.user-menu';
  navbar = '.navbar';
  mainContent = '.main-content';

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardLoad() {
    await this.waitForElement(this.mainContent);
  }

  /**
   * Get user greeting text
   * @returns {Promise<string>} Greeting text
   */
  async getUserGreeting() {
    return await this.getText(this.userGreeting);
  }

  /**
   * Click user menu
   */
  async clickUserMenu() {
    await this.click(this.userMenu);
  }

  /**
   * Logout user
   */
  async logout() {
    await this.clickUserMenu();
    await this.click(this.logoutButton);
    await this.waitForNavigation();
  }

  /**
   * Verify dashboard title
   * @returns {Promise<string>} Page title
   */
  async getDashboardTitle() {
    return await this.getTitle();
  }

  /**
   * Check if navbar is visible
   * @returns {Promise<boolean>} True if navbar is visible
   */
  async isNavbarVisible() {
    return await this.isVisible(this.navbar);
  }
}
