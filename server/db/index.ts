import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.js';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use file-based database for persistence
const dbPath = join(__dirname, '../../../healthbudget.db');
const sqlite = new Database(dbPath, { verbose: console.log });

// Enable foreign key constraints and WAL mode for better performance
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

// Create the Drizzle instance
const db = drizzle(sqlite, { schema });

// Helper function to execute raw SQL
const sql = {
  run: (query: string, params: any[] = []) => {
    return sqlite.prepare(query).run(...params);
  },
  all: (query: string, params: any[] = []) => {
    return sqlite.prepare(query).all(...params);
  },
  get: (query: string, params: any[] = []) => {
    return sqlite.prepare(query).get(...params);
  }
};

// Test the connection
console.log(`✅ Connected to SQLite database at ${dbPath}`);

// Test the database connection
async function testConnection() {
  try {
    // Try to query the sqlite_master table to check if the database is accessible
    const result = await db.select().from(schema.dentalClinics).limit(1).all();
    console.log('✅ Database connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return false;
  }
}

// Export everything
export const database = db;
export type Database = typeof db;
export * as schemaExports from './schema.js';
export { sql, testConnection };

export default database;
