import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check for required environment variable
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create PostgreSQL connection
const connectionString = process.env.DATABASE_URL;

// Base connection options to handle connectivity issues
const baseConnectionOptions = {
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 30, // Increase connection timeout to 30 seconds
  ssl: 'require' as const, // Require SSL connection
  prepare: false, // Disable prepared statements for better compatibility
  // Allow both IPv4 and IPv6
  family: 0, // Allow both IPv4 and IPv6 (0 = auto)
};

// For migrations (with max 1 connection)
export const migrationClient = postgres(connectionString, { 
  max: 1,
  ...baseConnectionOptions
});

// For queries (connection pool)
const queryClient = postgres(connectionString, {
  max: 10, // Connection pool size
  ...baseConnectionOptions
});

// Create Drizzle instance with schema
export const db = drizzle(queryClient, { schema });

// Type export for use across the app
export type DbType = typeof db;
