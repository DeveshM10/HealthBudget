import { database as db } from '../server/db/index.js';
import { dentalClinics } from '../server/db/schema.js';

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
  }
];

async function importClinics() {
  try {
    console.log('Starting to import dental clinics...');
    
    // Check if we already have data
    const existingClinics = await db.select().from(dentalClinics).limit(1).all();
    
    if (existingClinics.length > 0) {
      console.log('ℹ️ Dental clinics already exist in the database. Skipping import.');
      return;
    }
    
    // Insert clinics
    for (const clinic of sampleClinics) {
      await db.insert(dentalClinics).values({
        ...clinic,
        website: clinic.website || null
      }).run();
    }
    
    console.log(`✅ Successfully imported ${sampleClinics.length} dental clinics.`);
    return true;
  } catch (error) {
    console.error('❌ Error importing dental clinics:', error);
    throw error;
  }
}

importClinics()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
