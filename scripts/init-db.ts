import { database as db, sql } from '../server/db/index.js';

async function initDb() {
  try {
    // Enable foreign key support
    sql.run('PRAGMA foreign_keys = ON');
    
    // Enable WAL mode for better performance
    sql.run('PRAGMA journal_mode = WAL');
    
    // Create dental_clinics table
    sql.run(`
      CREATE TABLE IF NOT EXISTS dental_clinics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinic_name TEXT NOT NULL,
        doctor_name TEXT,
        address TEXT,
        city TEXT,
        pin_code TEXT,
        state TEXT,
        mobile_number TEXT,
        phone_number TEXT,
        email TEXT,
        website TEXT,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
      )
    `);

    // Create indexes
    sql.run('CREATE INDEX IF NOT EXISTS idx_dental_clinics_city ON dental_clinics(city)');
    sql.run('CREATE INDEX IF NOT EXISTS idx_dental_clinics_state ON dental_clinics(state)');
    sql.run('CREATE INDEX IF NOT EXISTS idx_dental_clinics_pin_code ON dental_clinics(pin_code)');

    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

initDb()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  });
