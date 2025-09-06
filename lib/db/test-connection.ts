import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'node:path';
import fs from 'node:fs';

// Test database connection and setup
export async function setupTestDatabase() {
  const databaseUrl = process.env.POSTGRES_URL || 'postgresql://test:test@localhost:5432/test';
  
  try {
    // Try to connect to the database
    const client = postgres(databaseUrl, { max: 1 });
    const db = drizzle(client);
    
    // Check if we can connect
    await client`SELECT 1`;
    
    // Run migrations if needed
    const migrationsFolder = path.join(process.cwd(), 'lib/db/migrations');
    if (fs.existsSync(migrationsFolder)) {
      console.log('Running database migrations...');
      await migrate(db, { migrationsFolder });
      console.log('Migrations completed successfully');
    }
    
    await client.end();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Check if database is available
export async function isDatabaseAvailable() {
  const databaseUrl = process.env.POSTGRES_URL || 'postgresql://test:test@localhost:5432/test';
  
  try {
    const client = postgres(databaseUrl, { max: 1 });
    await client`SELECT 1`;
    await client.end();
    return true;
  } catch (error) {
    return false;
  }
}