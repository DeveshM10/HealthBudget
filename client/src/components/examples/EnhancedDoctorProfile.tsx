import EnhancedDoctorProfile from '../EnhancedDoctorProfile';
import doctorPhoto from "@assets/generated_images/Doctor_profile_photo_63744992.png";

const sampleDetailedDoctor = {
  id: "1",
  name: "Priya Sharma",
  profilePhoto: doctorPhoto,
  primarySpecialty: "Interventional Cardiology",
  subSpecialties: ["Coronary Angioplasty", "Structural Heart Disease", "Heart Failure Management"],
  yearsOfExperience: 15,
  consultationFee: 1500,
  rating: 4.9,
  totalConsultations: 2847,
  totalReviews: 892,
  
  credentials: {
    medicalLicense: "MH-12345-CD-2023",
    licenseState: "Maharashtra",
    licenseExpiry: "2025-12-31",
    boardCertifications: [
      "American Board of Internal Medicine - Cardiology",
      "European Society of Cardiology - Interventional Cardiology",
      "Indian Association of Cardiovascular and Thoracic Surgeons"
    ],
    fellowships: [
      "Interventional Cardiology Fellowship - Mayo Clinic",
      "Advanced Heart Failure Fellowship - Cleveland Clinic"
    ]
  },
  
  education: {
    medicalSchool: "All Institute of Medical Sciences (AIIMS), New Delhi",
    residency: "Internal Medicine Residency - AIIMS, New Delhi",
    fellowship: "Cardiology Fellowship - PGIMER, Chandigarh",
    graduationYear: 2008
  },
  
  hospitalAffiliations: [
    "Kokilaben Dhirubhai Ambani Hospital",
    "Jaslok Hospital & Research Centre",
    "Breach Candy Hospital Trust",
    "Asian Heart Institute"
  ],
  
  specialInterests: [
    "Complex Coronary Interventions",
    "Transcatheter Aortic Valve Replacement (TAVR)",
    "Mitral Valve Repair",
    "Cardiac Catheterization",
    "Preventive Cardiology"
  ],
  
  languages: ["English", "Hindi", "Marathi", "Gujarati"],
  
  city: "Mumbai",
  state: "Maharashtra",
  
  availableHours: {
    monday: [{ start: "09:00", end: "13:00" }, { start: "15:00", end: "18:00" }],
    tuesday: [{ start: "09:00", end: "13:00" }, { start: "15:00", end: "18:00" }],
    wednesday: [{ start: "09:00", end: "13:00" }],
    thursday: [{ start: "09:00", end: "13:00" }, { start: "15:00", end: "18:00" }],
    friday: [{ start: "09:00", end: "13:00" }, { start: "15:00", end: "18:00" }],
    saturday: [{ start: "09:00", end: "12:00" }]
  },
  
  nextAvailable: "Today 3:00 PM",
  
  researchPublications: [
    {
      title: "Outcomes of Transcatheter Aortic Valve Replacement in Indian Population",
      journal: "Indian Heart Journal",
      year: 2023,
      citations: 127
    },
    {
      title: "Complex Coronary Interventions: A Multi-center Study",
      journal: "Journal of Interventional Cardiology",
      year: 2022,
      citations: 89
    },
    {
      title: "Heart Failure Management in Resource-Limited Settings",
      journal: "International Journal of Cardiology",
      year: 2021,
      citations: 156
    }
  ],
  
  awards: [
    {
      title: "Outstanding Physician Award",
      organization: "Cardiological Society of India",
      year: 2023
    },
    {
      title: "Excellence in Interventional Cardiology",
      organization: "Indian Association of Cardiovascular Surgeons",
      year: 2022
    },
    {
      title: "Young Investigator Award",
      organization: "European Society of Cardiology",
      year: 2019
    }
  ],
  
  bio: "Dr. Priya Sharma is a renowned interventional cardiologist with over 15 years of experience in complex cardiac procedures. She specializes in minimally invasive cardiac interventions and has pioneered several techniques in transcatheter valve procedures. Dr. Sharma is actively involved in research and has published extensively in peer-reviewed journals. She is committed to providing personalized cardiac care with a focus on patient education and preventive cardiology.",
  
  patientSatisfactionScore: 97,
  averageResponseTime: "< 2 hours",
  providesEmergencyConsults: true,
  consultationTypes: ["Video Consultation", "Audio Consultation", "In-person Visit", "Emergency Consultation", "Second Opinion"]
};

export default function EnhancedDoctorProfileExample() {
  return (
    <div className="p-6">
      <EnhancedDoctorProfile 
        doctor={sampleDetailedDoctor}
        onBookConsultation={(doctor) => console.log('Book consultation:', doctor.name)}
        onEmergencyConsult={(doctor) => console.log('Emergency consultation:', doctor.name)}
        onSendMessage={(doctor) => console.log('Send message to:', doctor.name)}
      />
    </div>
  );
}