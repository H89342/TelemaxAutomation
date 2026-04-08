/**
 * Test Helper Utilities
 */

/**
 * Generate random email
 * @returns {string} Random email
 */
export function generateRandomEmail() {
  return `user-${Date.now()}@test.com`;
}

/**
 * Generate random string
 * @param {number} length - String length
 * @returns {string} Random string
 */
export function generateRandomString(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Wait for specified milliseconds
 * @param {number} ms - Milliseconds to wait
 */
export async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry function until success
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise<*>} Function result
 */
export async function retry(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await wait(delay);
    }
  }
}

/**
 * Get timestamp
 * @returns {string} Current timestamp
 */
export function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Assert that condition is true
 * @param {boolean} condition - Condition to assert
 * @param {string} message - Error message
 */
export function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Compare two arrays ignoring order
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {boolean} True if arrays contain same elements
 */
export function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return [...arr1].sort().every((val, index) => val === [...arr2].sort()[index]);
}

/**
 * Delay execution with optional jitter
 * @param {number} ms - Base delay in milliseconds
 * @param {number} jitter - Random jitter in ms (optional)
 */
export async function delayExecution(ms, jitter = 0) {
  const actualDelay = ms + (jitter > 0 ? Math.random() * jitter : 0);
  await wait(actualDelay);
}
