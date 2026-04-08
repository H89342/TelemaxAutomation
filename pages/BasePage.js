/**
 * BasePage - Base class for all page objects
 * Provides common methods for page interactions
 */
export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page object
   * @param {string} baseUrl - Base URL for the application
   */
  constructor(page, baseUrl = '') {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - URL path to navigate to
   */
  async goto(url) {
    const fullUrl = url.startsWith('http') ? url : this.baseUrl + url;
    await this.page.goto(fullUrl);
  }

  /**
   * Click on an element
   * @param {string} selector - CSS selector
   */
  async click(selector) {
    await this.page.click(selector);
  }

  /**
   * Fill input field with text
   * @param {string} selector - CSS selector
   * @param {string} text - Text to fill
   */
  async fillText(selector, text) {
    await this.page.fill(selector, text);
  }

  /**
   * Get text content of an element
   * @param {string} selector - CSS selector
   * @returns {Promise<string>} Text content
   */
  async getText(selector) {
    return await this.page.textContent(selector);
  }

  /**
   * Check if element is visible
   * @param {string} selector - CSS selector
   * @returns {Promise<boolean>} True if visible
   */
  async isVisible(selector) {
    return await this.page.isVisible(selector);
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - CSS selector
   * @param {number} timeout - Timeout in ms
   */
  async waitForElement(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Get the page title
   * @returns {Promise<string>} Page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Get the current URL
   * @returns {Promise<string>} Current URL
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Check if element is enabled
   * @param {string} selector - CSS selector
   * @returns {Promise<boolean>} True if enabled
   */
  async isEnabled(selector) {
    return await this.page.isEnabled(selector);
  }

  /**
   * Check if element is checked (for checkboxes/radio)
   * @param {string} selector - CSS selector
   * @returns {Promise<boolean>} True if checked
   */
  async isChecked(selector) {
    return await this.page.isChecked(selector);
  }

  /**
   * Check a checkbox or radio button
   * @param {string} selector - CSS selector
   */
  async check(selector) {
    await this.page.check(selector);
  }

  /**
   * Uncheck a checkbox
   * @param {string} selector - CSS selector
   */
  async uncheck(selector) {
    await this.page.uncheck(selector);
  }

  /**
   * Select option from dropdown
   * @param {string} selector - CSS selector
   * @param {string} value - Option value or label
   */
  async selectOption(selector, value) {
    await this.page.selectOption(selector, value);
  }

  /**
   * Get all text from elements matching selector
   * @param {string} selector - CSS selector
   * @returns {Promise<string[]>} Array of text contents
   */
  async getAllText(selector) {
    return await this.page.locator(selector).allTextContents();
  }

  /**
   * Clear input field
   * @param {string} selector - CSS selector
   */
  async clearInput(selector) {
    await this.page.fill(selector, '');
  }

  /**
   * Take screenshot
   * @param {string} filename - Screenshot filename
   */
  async takeScreenshot(filename) {
    await this.page.screenshot({ path: `screenshots/${filename}.png` });
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation() {
    await this.page.waitForNavigation();
  }

  /**
   * Get value of input element
   * @param {string} selector - CSS selector
   * @returns {Promise<string>} Input value
   */
  async getValue(selector) {
    return await this.page.inputValue(selector);
  }
}
