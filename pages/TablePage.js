/**
 * Table Page Object
 * Handles table interactions and data extraction
 */

import { BasePage } from './BasePage.js';

export class TablePage extends BasePage {
  /**
   * Get table data as array of objects
   * @param {string} tableSelector - Table selector
   * @returns {Promise<Array>} Table data
   */
  async getTableData(tableSelector) {
    const rows = await this.page.locator(`${tableSelector} tbody tr`).all();
    const headers = await this.page.locator(
      `${tableSelector} thead th`
    ).allTextContents();

    const data = [];
    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = cells[index];
      });
      data.push(rowData);
    }

    return data;
  }

  /**
   * Find row in table by specific criteria
   * @param {string} tableSelector - Table selector
   * @param {object} criteria - Search criteria
   * @returns {Promise<object>} Found row data
   */
  async findTableRow(tableSelector, criteria) {
    const data = await this.getTableData(tableSelector);
    return data.find((row) => {
      return Object.entries(criteria).every(([key, value]) => row[key] === value);
    });
  }

  /**
   * Get row count
   * @param {string} tableSelector - Table selector
   * @returns {Promise<number>} Number of rows
   */
  async getRowCount(tableSelector) {
    return await this.page.locator(`${tableSelector} tbody tr`).count();
  }

  /**
   * Click cell in row
   * @param {string} tableSelector - Table selector
   * @param {number} rowIndex - Row index
   * @param {number} cellIndex - Cell index
   */
  async clickTableCell(tableSelector, rowIndex, cellIndex) {
    const selector = `${tableSelector} tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${cellIndex + 1})`;
    await this.click(selector);
  }

  /**
   * Search in table
   * @param {string} searchBoxSelector - Search input selector
   * @param {string} term - Search term
   */
  async searchTable(searchBoxSelector, term) {
    await this.fillText(searchBoxSelector, term);
    await this.page.waitForTimeout(500); // Wait for search results
  }

  /**
   * Sort table column
   * @param {string} columnHeaderSelector - Column header selector
   */
  async sortColumn(columnHeaderSelector) {
    await this.click(columnHeaderSelector);
  }
}
