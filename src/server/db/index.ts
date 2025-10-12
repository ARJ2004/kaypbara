import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check for required environment variable
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create PostgreSQL connection
const connectionString = process.env.DATABASE_URL;

// For migrations (with max 1 connection)
export const migrationClient = postgres(connectionString, { max: 1 });

// For queries (connection pool)
const queryClient = postgres(connectionString);

// Create Drizzle instance with schema
export const db = drizzle(queryClient, { schema });

// Type export for use across the app
export type DbType = typeof db;
