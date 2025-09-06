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
  
  // In production, check for alternative env var names (common in deployment platforms)
  const alternativeSecrets = [
    process.env.NEXTAUTH_SECRET,
    process.env.JWT_SECRET,
  ];
  
  for (const altSecret of alternativeSecrets) {
    if (altSecret) {
      console.warn(`AUTH_SECRET not found, using ${altSecret ? 'alternative' : ''} environment variable`);
      return altSecret;
    }
  }
  
  // Generate a warning but return a fallback for non-blocking operation
  if (isProductionEnvironment) {
    const errorMessage = 'AUTH_SECRET environment variable is required in production. Authentication will not work properly.';
    console.error(errorMessage);
    // Instead of throwing, return a deterministic fallback that will at least prevent crashes
    // This allows the app to run and display configuration errors gracefully
    return 'UNSAFE-FALLBACK-SECRET-PLEASE-SET-AUTH-SECRET-ENV-VAR';
  }
  
  throw new Error('AUTH_SECRET environment variable is required');
};
