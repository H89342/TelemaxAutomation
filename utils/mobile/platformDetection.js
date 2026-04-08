/**
 * Platform Detection Utilities
 * Detects iOS vs Android and provides platform-specific helpers
 */

export const PLATFORMS = {
  IOS: 'ios',
  ANDROID: 'android',
};

/**
 * Get current platform from context
 * @param {import('@playwright/test').Page} page - Playwright page
 * @returns {string} Platform (ios or android)
 */
export function getPlatform(page) {
  const userAgent = page.context().browser().browserType().name();
  
  if (userAgent.includes('webkit')) {
    return PLATFORMS.IOS;
  }
  
  return PLATFORMS.ANDROID;
}

/**
 * Check if running on iOS
 * @param {import('@playwright/test').Page} page - Playwright page
 * @returns {boolean} True if iOS
 */
export function isIOS(page) {
  return getPlatform(page) === PLATFORMS.IOS;
}

/**
 * Check if running on Android
 * @param {import('@playwright/test').Page} page - Playwright page
 * @returns {boolean} True if Android
 */
export function isAndroid(page) {
  return getPlatform(page) === PLATFORMS.ANDROID;
}

/**
 * Get platform-specific selector
 * @param {string} iosSelector - iOS selector
 * @param {string} androidSelector - Android selector
 * @param {import('@playwright/test').Page} page - Playwright page
 * @returns {string} Platform-specific selector
 */
export function getPlatformSelector(iosSelector, androidSelector, page) {
  return isIOS(page) ? iosSelector : androidSelector;
}

/**
 * Get platform capabilities
 * @param {import('@playwright/test').Page} page - Playwright page
 * @returns {object} Platform capabilities
 */
export function getPlatformCapabilities(page) {
  const platform = getPlatform(page);
  
  return {
    platform,
    isIOS: platform === PLATFORMS.IOS,
    isAndroid: platform === PLATFORMS.ANDROID,
    hasBackGesture: platform === PLATFORMS.IOS,
    hasHardwareBackButton: platform === PLATFORMS.ANDROID,
    statusBarHeight: platform === PLATFORMS.IOS ? 44 : 24,
    navBarHeight: platform === PLATFORMS.IOS ? 49 : 56,
  };
}
