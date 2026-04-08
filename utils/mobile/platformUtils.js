/**
 * Platform-specific mobile utilities
 */

/**
 * Get Android-specific testID selector
 * @param {string} testID - Android test ID
 * @returns {string} Selector
 */
export function getAndroidTestID(testID) {
  return `[data-testid="${testID}"]`;
}

/**
 * Get iOS-specific accessibility ID selector
 * @param {string} accessibilityID - iOS accessibility ID
 * @returns {string} Selector
 */
export function getIOSAccessibilityID(accessibilityID) {
  return `[data-accessibility-id="${accessibilityID}"]`;
}

/**
 * Convert iOS accessibility ID to Android test ID
 * @param {string} id - iOS accessibility ID
 * @returns {string} Android test ID equivalent
 */
export function convertIOStoAndroid(id) {
  // Convert camelCase to snake_case for Android
  return id.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

/**
 * Get platform-safe element locator
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {string} iosID - iOS accessibility ID
 * @param {string} alternateSelector - Fallback CSS selector
 * @returns {import('@playwright/test').Locator} Locator
 */
export function getPlatformElementLocator(page, iosID, alternateSelector) {
  const isIOS = !page.context().browser().browserType().name().includes('chromium');
  
  if (isIOS) {
    return page.locator(`[data-accessibility-id="${iosID}"]`).or(page.locator(alternateSelector));
  } else {
    const androidID = convertIOStoAndroid(iosID);
    return page.locator(`[data-testid="${androidID}"]`).or(page.locator(alternateSelector));
  }
}

/**
 * Wait for platform-specific element
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {string} iosID - iOS accessibility ID
 * @param {string} androidID - Android test ID
 * @param {number} timeout - Timeout in ms
 */
export async function waitForPlatformElement(page, iosID, androidID, timeout = 5000) {
  const isIOS = !page.context().browser().browserType().name().includes('chromium');
  
  if (isIOS) {
    await page.waitForSelector(`[data-accessibility-id="${iosID}"]`, { timeout });
  } else {
    await page.waitForSelector(`[data-testid="${androidID}"]`, { timeout });
  }
}

/**
 * Tap element with haptic feedback simulation
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {string} selector - Element selector
 */
export async function tapWithHaptic(page, selector) {
  // Tap element
  await page.tap(selector);
  
  // Simulate haptic feedback (visual only)
  // Real haptic feedback would require device capability
}

/**
 * Handle platform-specific back navigation
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {boolean} isIOS - Is iOS platform
 */
export async function handleBackNavigation(page, isIOS) {
  if (isIOS) {
    // iOS: look for back button
    const backButton = page.locator('button[aria-label*="Back"], button[aria-label*="back"]').first();
    if (await backButton.isVisible()) {
      await backButton.click();
    } else {
      // iOS swipe back gesture
      const { width, height } = page.viewportSize();
      await page.touchscreen.tap(10, height / 2);
      await page.touchscreen.move(width / 2, height / 2);
      await page.touchscreen.release();
    }
  } else {
    // Android: hardware back button
    await page.keyboard.press('Backspace');
  }
}

/**
 * Get platform-specific viewport sizes
 * @returns {object} Platform viewport mapping
 */
export function getPlatformViewports() {
  return {
    // iOS devices
    'iPhone SE': { width: 375, height: 667 },
    'iPhone 12': { width: 390, height: 844 },
    'iPhone 12 Pro': { width: 390, height: 844 },
    'iPhone 13': { width: 390, height: 844 },
    'iPhone 13 Pro': { width: 390, height: 844 },
    'iPhone 14': { width: 390, height: 844 },
    'iPhone 14 Pro': { width: 393, height: 852 },
    'iPad': { width: 768, height: 1024 },
    'iPad Pro': { width: 1024, height: 1366 },
    // Android devices
    'Pixel 4': { width: 353, height: 745 },
    'Pixel 5': { width: 393, height: 851 },
    'Galaxy S10': { width: 360, height: 800 },
    'Galaxy S21': { width: 360, height: 800 },
    'Galaxy Note 20': { width: 360, height: 800 },
  };
}
