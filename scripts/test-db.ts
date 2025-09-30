import { database as db, sql } from '../server/db/index.js';
import { dentalClinics } from '../server/db/schema.js';

async function testDatabase() {
  try {
    console.log('🚀 Testing database connection...');
    
    // Test raw SQL query
    const dbInfo = await sql.get("SELECT sqlite_version() as version, name FROM sqlite_master WHERE type='table'");
    console.log('📊 Database Info:', JSON.stringify(dbInfo, null, 2));
    
    // Test connection with a simple query
    const testResult = await db.select().from(dentalClinics).limit(1).all();
    console.log('✅ Database connection test successful');
    
    // Get all clinics
    console.log('\n🔍 Fetching all dental clinics...');
    const clinics = await db.select().from(dentalClinics).all();
    
    if (clinics.length === 0) {
      console.log('ℹ️ No dental clinics found in the database');
    } else {
      console.log(`✅ Found ${clinics.length} dental clinics:`);
      clinics.forEach((clinic, index) => {
        console.log(`\n📌 Clinic #${index + 1}:`);
        console.log('----------------------------');
        Object.entries(clinic).forEach(([key, value]) => {
          console.log(`${key.padEnd(15)}: ${value || '(empty)'}`);
        });
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database test failed:');
    if (error instanceof Error) {
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
}

// Run the test
console.log('🏁 Starting database test...');
testDatabase()
  .then(() => {
    console.log('✨ Database test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database test failed with error:', error);
    process.exit(1);
  });
