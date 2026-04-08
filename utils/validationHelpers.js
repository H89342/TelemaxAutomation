/**
 * Validation Utilities
 * Functions for common validation scenarios
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with details
 */
export function validatePasswordStrength(password) {
  const result = {
    isValid: false,
    errors: [],
  };

  if (password.length < 8) {
    result.errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    result.errors.push('Password must contain uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    result.errors.push('Password must contain lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    result.errors.push('Password must contain number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    result.errors.push('Password must contain special character');
  }

  result.isValid = result.errors.length === 0;
  return result;
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export function isValidPhoneNumber(phone) {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate date format
 * @param {string} date - Date string
 * @param {string} format - Date format (YYYY-MM-DD, DD/MM/YYYY, etc.)
 * @returns {boolean} True if valid
 */
export function isValidDateFormat(date, format = 'YYYY-MM-DD') {
  const patterns = {
    'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
    'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
    'MM-DD-YYYY': /^\d{2}-\d{2}-\d{4}$/,
  };

  const pattern = patterns[format];
  return pattern ? pattern.test(date) : false;
}

/**
 * Validate credit card
 * @param {string} cardNumber - Card number
 * @returns {boolean} True if valid (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber) {
  const cleaned = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Compare two values with type coercion
 * @param {*} actual - Actual value
 * @param {*} expected - Expected value
 * @returns {boolean} True if equal
 */
export function isEqual(actual, expected) {
  if (typeof actual !== typeof expected) {
    return false;
  }

  if (Array.isArray(actual) && Array.isArray(expected)) {
    return JSON.stringify(actual) === JSON.stringify(expected);
  }

  if (typeof actual === 'object' && typeof expected === 'object') {
    return JSON.stringify(actual) === JSON.stringify(expected);
  }

  return actual === expected;
}

/**
 * Check if value is within range
 * @param {number} value - Value to check
   * @param {number} min - Minimum value (inclusive)
   * @param {number} max - Maximum value (inclusive)
   * @returns {boolean} True if within range
   */
export function isInRange(value, min, max) {
  return value >= min && value <= max;
}
