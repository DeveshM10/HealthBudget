import PatientHealthRecord from '../PatientHealthRecord';

// Mock patient data - todo: remove mock functionality
const samplePatient = {
  id: "P-2024-001",
  fullName: "Rajesh Kumar Sharma",
  dateOfBirth: "1985-03-15",
  age: 39,
  gender: "male" as const,
  bloodGroup: "B+",
  phoneNumber: "+91 98765 43210",
  email: "rajesh.sharma@email.com",
  address: {
    street: "123 MG Road, Sector 15",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  },
  emergencyContacts: [
    {
      name: "Priya Sharma",
      relationship: "wife",
      phoneNumber: "+91 98765 43211",
      email: "priya.sharma@email.com"
    },
    {
      name: "Dr. Amit Patel",
      relationship: "family doctor",
      phoneNumber: "+91 98765 43212"
    }
  ],
  
  allergies: [
    {
      allergen: "Penicillin",
      severity: "severe" as const,
      reaction: "Rash, difficulty breathing",
      confirmedDate: "2019-08-12"
    },
    {
      allergen: "Shellfish",
      severity: "moderate" as const,
      reaction: "Hives, nausea",
      confirmedDate: "2020-05-20"
    }
  ],
  
  chronicConditions: ["Type 2 Diabetes", "Hypertension"],
  
  medicalHistory: [
    {
      condition: "Type 2 Diabetes Mellitus",
      diagnosedDate: "2018-11-15",
      status: "chronic" as const,
      treatingPhysician: "Dr. Meera Singh",
      notes: "Well controlled with medication and lifestyle modifications. HbA1c maintained below 7%."
    },
    {
      condition: "Essential Hypertension",
      diagnosedDate: "2020-02-10",
      status: "chronic" as const,
      treatingPhysician: "Dr. Amit Patel",
      notes: "Controlled with ACE inhibitors. Regular monitoring required."
    },
    {
      condition: "Appendicitis",
      diagnosedDate: "2016-07-22",
      status: "resolved" as const,
      treatingPhysician: "Dr. Ravi Kumar",
      notes: "Laparoscopic appendectomy performed. Complete recovery."
    }
  ],
  
  currentMedications: [
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      startDate: "2018-11-15",
      prescribedBy: "Dr. Meera Singh",
      purpose: "Blood sugar control",
      status: "active" as const
    },
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "2020-02-10",
      prescribedBy: "Dr. Amit Patel",
      purpose: "Blood pressure control",
      status: "active" as const
    },
    {
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily at bedtime",
      startDate: "2021-01-05",
      prescribedBy: "Dr. Meera Singh",
      purpose: "Cholesterol management",
      status: "active" as const
    }
  ],
  
  familyHistory: [
    {
      relation: "father",
      conditions: ["Type 2 Diabetes", "Coronary Artery Disease"],
      ageAtDiagnosis: 55,
      notes: "Diagnosed with diabetes at 55, had heart attack at 62"
    },
    {
      relation: "mother",
      conditions: ["Hypertension", "Osteoporosis"],
      ageAtDiagnosis: 60,
      notes: "Hypertension since age 60, osteoporosis diagnosed at 65"
    },
    {
      relation: "paternal grandfather",
      conditions: ["Stroke"],
      ageAtDiagnosis: 70,
      notes: "Had stroke at age 70, recovered partially"
    }
  ],
  
  vitalSigns: [
    {
      date: "2024-09-15",
      bloodPressure: { systolic: 128, diastolic: 82 },
      heartRate: 72,
      temperature: 98.6,
      weight: 78.5,
      height: 175,
      bmi: 25.6
    },
    {
      date: "2024-06-10",
      bloodPressure: { systolic: 132, diastolic: 85 },
      heartRate: 75,
      temperature: 98.4,
      weight: 79.2,
      height: 175,
      bmi: 25.9
    },
    {
      date: "2024-03-12",
      bloodPressure: { systolic: 135, diastolic: 88 },
      heartRate: 78,
      temperature: 98.7,
      weight: 80.1,
      height: 175,
      bmi: 26.2
    }
  ],
  
  insuranceProvider: "Star Health Insurance",
  policyNumber: "SH-123456789",
  preferredBudgetRange: "specialist" as const,
  
  registrationDate: "2022-01-15",
  lastVisit: "2024-09-15",
  totalConsultations: 12,
  preferredLanguages: ["Hindi", "English", "Marathi"]
};

export default function PatientHealthRecordExample() {
  return (
    <div className="p-6">
      <PatientHealthRecord 
        patient={samplePatient}
        isEditable={true}
        onUpdateRecord={(updates) => console.log('Update patient record:', updates)}
        onAddMedication={(medication) => console.log('Add medication:', medication)}
        onAddAllergy={(allergy) => console.log('Add allergy:', allergy)}
        onAddVitalSigns={(vitals) => console.log('Add vital signs:', vitals)}
      />
    </div>
  );
}