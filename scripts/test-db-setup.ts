#!/usr/bin/env tsx

import { setupTestDatabase, isDatabaseAvailable } from '../lib/db/test-connection';

async function main() {
  console.log('🔍 Checking database availability...');
  
  const isAvailable = await isDatabaseAvailable();
  
  if (!isAvailable) {
    console.log('❌ Database is not available. This is normal for unit/integration tests.');
    console.log('ℹ️  For E2E tests, you can either:');
    console.log('   1. Start a PostgreSQL instance with: docker run --name test-postgres -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test -e POSTGRES_DB=test -p 5432:5432 -d postgres:15');
    console.log('   2. Or set up a PostgreSQL database and update .env.test with the connection string');
    process.exit(0);
  }
  
  console.log('✅ Database is available');
  
  const setupResult = await setupTestDatabase();
  
  if (setupResult) {
    console.log('✅ Database setup completed successfully');
  } else {
    console.log('❌ Database setup failed');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}