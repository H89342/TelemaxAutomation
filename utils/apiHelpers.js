/**
 * API Helper Utilities
 * Functions for API testing and interactions
 */

/**
 * Parse JSON response
 * @param {Response} response - HTTP response
 * @returns {Promise<object>} Parsed JSON
 */
export async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error.message}`);
  }
}

/**
 * Verify response status
 * @param {Response} response - HTTP response
 * @param {number} expectedStatus - Expected status code
 */
export function verifyResponseStatus(response, expectedStatus) {
  if (response.status !== expectedStatus) {
    throw new Error(
      `Expected status ${expectedStatus}, got ${response.status}`
    );
  }
}

/**
 * Extract bearer token from response
 * @param {object} data - Response data
 * @returns {string} Bearer token
 */
export function extractToken(data) {
  return data.token || data.accessToken || data.access_token;
}

/**
 * Create authorization header
 * @param {string} token - Authentication token
 * @returns {object} Authorization header
 */
export function createAuthHeader(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Create headers with content type
 * @param {string} contentType - Content type
 * @returns {object} Headers object
 */
export function createHeaders(contentType = 'application/json') {
  return {
    'Content-Type': contentType,
  };
}

/**
 * Create form data
 * @param {object} data - Data to convert to FormData
 * @returns {FormData} FormData object
 */
export function createFormData(data) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  }
  return formData;
}

/**
 * Validate response structure
 * @param {object} data - Response data
 * @param {Array<string>} requiredFields - Required field names
 */
export function validateResponseStructure(data, requiredFields) {
  const missingFields = requiredFields.filter((field) => !(field in data));
  if (missingFields.length > 0) {
    throw new Error(`Missing fields: ${missingFields.join(', ')}`);
  }
}
