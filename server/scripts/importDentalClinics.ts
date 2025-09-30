import { db } from '../db/index.js';
import { dentalClinics } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Sample data - in a real scenario, you would parse this from a file or API
const sampleClinics = [
  {
    clinicName: 'Prasad Dental Clinic',
    doctorName: 'Himanshu Agarwal',
    address: 'No.-1 New Market T. T. Nagar',
    city: 'Bhopal',
    pinCode: '462016',
    state: 'Madhya Pradesh',
    mobileNumber: '9425007478',
    phoneNumber: '755-2554239',
    email: 'drhimanshubds@yahoo.co.in',
    website: 'http://prasaddentalclinic.com/'
  },
  {
    clinicName: 'Smile Makeers Dental Clinic',
    doctorName: 'Ashish Bandewar',
    address: '103 First floor Sai Vastu Heights, Pimple Saudagar',
    city: 'Pune',
    pinCode: '411027',
    state: 'Maharashtra',
    mobileNumber: '9422492255',
    phoneNumber: '20-27402233',
    email: 'smilemakersdentalclinic32@gmail.com',
    website: 'http://www.smilemakersdentalclinic.com'
  },
  // Add more clinics here...
];

async function importClinics() {
  try {
    console.log('Starting to import dental clinics...');
    
    // Check if we already have data
    const existingCount = await db.select().from(dentalClinics).limit(1);
    
    if (existingCount.length > 0) {
      console.log('Dental clinics already exist in the database. Skipping import.');
      return;
    }
    
    // Insert clinics
    const result = await db.insert(dentalClinics).values(sampleClinics).returning();
    
    console.log(`Successfully imported ${result.length} dental clinics.`);
  } catch (error) {
    console.error('Error importing dental clinics:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the import
importClinics();
