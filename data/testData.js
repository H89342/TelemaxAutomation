/**
 * Test Data
 * Contains test data for various scenarios
 */

export const testUsers = {
  validUser: {
    email: 'testuser@example.com',
    password: 'Test@123456',
    name: 'Test User',
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'Admin@123456',
    name: 'Admin User',
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
    name: 'Invalid User',
  },
};

export const testProducts = {
  product1: {
    name: 'Product A',
    sku: 'SKU-001',
    price: 29.99,
    quantity: 10,
  },
  product2: {
    name: 'Product B',
    sku: 'SKU-002',
    price: 49.99,
    quantity: 5,
  },
  product3: {
    name: 'Product C',
    sku: 'SKU-003',
    price: 99.99,
    quantity: 1,
  },
};

export const testOrders = {
  order1: {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 79.98,
  },
  order2: {
    id: 'ORD-002',
    date: '2024-02-20',
    status: 'processing',
    total: 149.97,
  },
};

export const formData = {
  contactForm: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    message: 'This is a test message',
  },
  registrationForm: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'SecurePass@123',
    confirmPassword: 'SecurePass@123',
  },
};

export const apiTestData = {
  createUserPayload: {
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
  },
  updateUserPayload: {
    name: 'Updated User',
    email: 'updated@example.com',
  },
};

export default {
  testUsers,
  testProducts,
  testOrders,
  formData,
  apiTestData,
};
