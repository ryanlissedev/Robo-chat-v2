import { generateDummyPassword } from './db/utils';

export const isProductionEnvironment = process.env.NODE_ENV === 'production';
export const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT,
);

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();

// AUTH_SECRET with fallback for CI/CD environments
export const getAuthSecret = () => {
  const secret = process.env.AUTH_SECRET;
  
  if (secret) {
    return secret;
  }
  
  // Fallback for CI/CD environments
  if (isTestEnvironment || process.env.CI) {
    const fallbackSecret = 'test-secret-key-for-ci-cd-environments-12345678901234567890';
    console.warn('AUTH_SECRET not found, using fallback for CI/CD environment');
    return fallbackSecret;
  }
  
  throw new Error('AUTH_SECRET environment variable is required');
};
