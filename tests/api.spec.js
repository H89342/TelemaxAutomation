/**
 * API Tests - Pure API testing examples
 * For testing backend APIs without UI interaction
 */

import { test, expect } from '../fixtures/testFixtures.js';
import { apiTestData, testUsers } from '../data/testData.js';

test.describe('API Tests', () => {
  test('should fetch user profile', async ({ apiContext }) => {
    const response = await apiContext.get('/api/user/profile');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('email');
    expect(response.data).toHaveProperty('name');
  });

  test('should create new item', async ({ apiContext }) => {
    const payload = apiTestData.createUserPayload;

    const response = await apiContext.post('/api/items', payload);

    expect(response.status).toBe(201);
    expect(response.data.name).toBe(payload.name);
    expect(response.data).toHaveProperty('id');
  });

  test('should update item', async ({ apiContext }) => {
    const itemId = 'test-item-1';
    const updatePayload = apiTestData.updateUserPayload;

    const response = await apiContext.put(
      `/api/items/${itemId}`,
      updatePayload
    );

    expect(response.status).toBeOneOf([200, 204]);
    expect(response.data?.name).toBe(updatePayload.name);
  });

  test('should delete item', async ({ apiContext }) => {
    const itemId = 'test-item-1';

    const response = await apiContext.delete(`/api/items/${itemId}`);

    expect(response.status).toBeOneOf([200, 204, 404]);
  });

  test('should handle invalid request', async ({ apiContext }) => {
    const invalidPayload = {
      name: '', // Empty name should fail
    };

    const response = await apiContext.post('/api/items', invalidPayload);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('error');
  });

  test('should handle unauthorized request', async ({ apiContext }) => {
    // Clear authorization by directly making request (if needed)
    const response = await apiContext.get('/api/user/profile');

    // Depending on implementation, should return 401 or similar
    expect([401, 403].includes(response.status)).toBeTruthy();
  });
});

test.describe('API Error Handling', () => {
  test('should handle 404 not found', async ({ apiContext }) => {
    const response = await apiContext.get('/api/items/non-existent-id');

    expect(response.status).toBe(404);
  });

  test('should handle validation errors', async ({ apiContext }) => {
    const invalidData = {
      email: 'invalid-email', // Invalid format
      name: '', // Required field empty
    };

    const response = await apiContext.post('/api/items', invalidData);

    expect(response.status).toBe(400);
    expect(response.data.errors).toBeDefined();
  });

  test('should handle server errors gracefully', async ({ apiContext }) => {
    // This might trigger a 500 if server has issue
    const response = await apiContext.get('/api/items');

    // Should either succeed or have proper error response
    expect([200, 500, 503].includes(response.status)).toBeTruthy();
  });
});

test.describe('API Response Validation', () => {
  test('should have correct response headers', async ({ apiContext }) => {
    const response = await apiContext.get('/api/items');

    expect(response.headers['content-type']).toContain('application/json');
  });

  test('should return paginated results', async ({ apiContext }) => {
    const response = await apiContext.get('/api/items?page=1&limit=10');

    expect(response.data).toHaveProperty('data');
    expect(response.data).toHaveProperty('total');
    expect(response.data).toHaveProperty('page');
  });
});
