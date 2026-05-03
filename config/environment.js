/**
 * Environment Configuration
 * Loads environment-specific settings
 */

const config = {
  dev: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    apiUrl: process.env.API_URL || 'http://localhost:3001/api',
    username: process.env.DEV_USERNAME || 'testuser@dev.com',
    password: process.env.DEV_PASSWORD || 'devPass123',
  },
  staging: {
    baseUrl: process.env.BASE_URL || 'https://staging.example.com',
    apiUrl: process.env.API_URL || 'https://staging-api.example.com/api',
    username: process.env.STAGING_USERNAME || 'testuser@staging.com',
    password: process.env.STAGING_PASSWORD || 'stagingPass123',
  },
  production: {
    baseUrl: process.env.BASE_URL || 'https://app.example.com',
    apiUrl: process.env.API_URL || 'https://api.example.com/api',
    username: process.env.PROD_USERNAME || 'testuser@prod.com',
    password: process.env.PROD_PASSWORD || 'prodPass123',
  },
};

/**
 * Get environment configuration
 * @param {string} env - Environment name (dev, staging, production)
 * @returns {object} Environment configuration
 */
export function getEnvironment(env = process.env.ENVIRONMENT || 'dev') {
  return config[env] || config.dev;
}
function requireEnvVar(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Required environment variable "${name}" is not set`);
  return value;
}
export default getEnvironment;
