# Test Setup and Database Configuration

This document explains how the test environment is configured and how to handle database-related testing issues.

## Test Types

### 1. Unit Tests (`tests/unit/`)
- **Database**: Uses mocked database functions (no real database required)
- **Purpose**: Test individual components and functions in isolation
- **Run with**: `pnpm run test:unit`

### 2. Integration Tests (`tests/integration/`)
- **Database**: Uses mocked database functions (no real database required)
- **Purpose**: Test component interactions and business logic
- **Run with**: `pnpm run test:integration`

### 3. E2E Tests (`tests/e2e/`) and Route Tests (`tests/routes/`)
- **Database**: Requires a real PostgreSQL database
- **Purpose**: Test the full application stack including API endpoints
- **Run with**: `pnpm run test:e2e`

## Database Setup

### For Unit and Integration Tests
No database setup required. The test setup (`tests/setup.ts`) automatically mocks all database functions.

### For E2E and Route Tests

#### Option 1: Use Docker (Recommended)
```bash
# Start a PostgreSQL test database
docker run --name test-postgres \
  -e POSTGRES_USER=test \
  -e POSTGRES_PASSWORD=test \
  -e POSTGRES_DB=test \
  -p 5432:5432 \
  -d postgres:15

# Check database setup
pnpm run test:db-check

# Run E2E tests
pnpm run test:e2e
```

#### Option 2: Use Local PostgreSQL
1. Install PostgreSQL locally
2. Create a test database:
   ```sql
   CREATE DATABASE test;
   CREATE USER test WITH PASSWORD 'test';
   GRANT ALL PRIVILEGES ON DATABASE test TO test;
   ```
3. Update `.env.test` with your database URL if needed
4. Run tests: `pnpm run test:e2e`

#### Option 3: Use a Cloud Database
1. Set up a test database on your preferred cloud provider
2. Update `.env.test` with the connection string
3. Run tests: `pnpm run test:e2e`

## Environment Configuration

### Test Environment Variables
- `.env.test`: Used by Playwright tests (E2E and routes)
- `tests/setup.ts`: Configures mocks for unit/integration tests

### Key Environment Variables
```bash
# Required for E2E tests
POSTGRES_URL="postgresql://test:test@localhost:5432/test"
AUTH_SECRET="test-secret-key-for-playwright-tests-12345678901234567890"

# Optional (have defaults for testing)
OPENAI_API_KEY="test-openai-key"
XAI_API_KEY="test-xai-key"
AUTH_GOOGLE_ID="test-google-id"
AUTH_GOOGLE_SECRET="test-google-secret"
```

## Troubleshooting

### "Database connection failed" Error
1. Check if PostgreSQL is running: `pnpm run test:db-check`
2. Verify connection string in `.env.test`
3. Ensure database exists and user has proper permissions

### E2E Tests Timeout
1. Check if the Next.js dev server is starting properly
2. Verify all required environment variables are set
3. Ensure database migrations have run successfully

### Unit/Integration Tests Failing
- These shouldn't require a database. If they're failing with database errors, check that the mocks in `tests/setup.ts` are properly configured.

## Test Scripts

- `pnpm run test`: Run all tests (unit, integration, e2e)
- `pnpm run test:unit`: Run only unit tests
- `pnpm run test:integration`: Run only integration tests  
- `pnpm run test:e2e`: Run only E2E tests
- `pnpm run test:db-check`: Check if test database is available and set up
- `pnpm run test:watch`: Run tests in watch mode
- `pnpm run test:ui`: Run tests with UI interface

## Database Migrations

The test database will automatically run migrations when:
1. The test database setup script runs (`pnpm run test:db-check`)
2. The Next.js development server starts for E2E tests

Migrations are located in `lib/db/migrations/` and are managed by Drizzle ORM.