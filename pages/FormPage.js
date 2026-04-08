/**
 * Form Page Object
 * Handles common form interactions
 */

import { BasePage } from './BasePage.js';

export class FormPage extends BasePage {
  /**
   * Fill form with data
   * @param {object} formData - Form data object
   */
  async fillForm(formData) {
    for (const [key, value] of Object.entries(formData)) {
      const selector = `input[name="${key}"], textarea[name="${key}"], select[name="${key}"]`;
      if (await this.isVisible(selector)) {
        const element = this.page.locator(selector).first();
        const tagName = await element.evaluate((el) => el.tagName);

        if (tagName === 'SELECT') {
          await this.selectOption(selector, value);
        } else if (tagName === 'TEXTAREA') {
          await this.fillText(selector, value);
        } else {
          await this.fillText(selector, value);
        }
      }
    }
  }

  /**
   * Submit form by clicking submit button
   * @param {string} submitSelector - Submit button selector
   */
  async submitForm(submitSelector = 'button[type="submit"]') {
    await this.click(submitSelector);
  }

  /**
   * Get form validation error
   * @param {string} fieldName - Field name
   * @returns {Promise<string>} Error message
   */
  async getFieldError(fieldName) {
    const errorSelector = `[data-error="${fieldName}"]`;
    return await this.getText(errorSelector);
  }

  /**
   * Clear form
   */
  async clearForm() {
    const inputs = await this.page.locator('input, textarea').all();
    for (const input of inputs) {
      await input.fill('');
    }
  }

  /**
   * Get form data
   * @returns {Promise<object>} Form data
   */
  async getFormData() {
    const inputs = await this.page.locator('input, textarea, select').all();
    const data = {};

    for (const input of inputs) {
      const name = await input.getAttribute('name');
      if (name) {
        const value = await input.inputValue();
        data[name] = value;
      }
    }

    return data;
  }
}
