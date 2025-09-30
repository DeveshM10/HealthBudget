import MedicalDocumentManager from '../MedicalDocumentManager';

const sampleDocuments = [
  {
    id: "doc-001",
    fileName: "Blood Test Results - Complete Blood Count",
    documentType: "lab_report" as const,
    fileUrl: "/documents/blood-test-001.pdf",
    fileSize: 2048576, // 2MB
    mimeType: "application/pdf",
    uploadedBy: "Dr. Priya Sharma",
    uploadDate: "2024-09-15",
    documentDate: "2024-09-14",
    issuingProvider: "Apollo Diagnostics, Mumbai",
    tags: ["CBC", "Routine", "Normal"],
    isActive: true,
    sharedWith: [
      {
        doctorId: "dr-001",
        doctorName: "Dr. Amit Patel",
        sharedAt: "2024-09-16",
        accessLevel: "view" as const
      }
    ],
    summary: "Complete blood count showing normal hemoglobin levels and white cell count within normal range.",
    patientId: "P-2024-001"
  },
  {
    id: "doc-002",
    fileName: "Diabetes Medication Prescription",
    documentType: "prescription" as const,
    fileUrl: "/documents/prescription-002.pdf",
    fileSize: 1024000, // 1MB
    mimeType: "application/pdf",
    uploadedBy: "Dr. Meera Singh",
    uploadDate: "2024-09-10",
    documentDate: "2024-09-10",
    issuingProvider: "Fortis Hospital, Mumbai",
    tags: ["Diabetes", "Metformin", "3-month"],
    isActive: true,
    sharedWith: [],
    summary: "3-month prescription for Metformin 500mg twice daily for Type 2 diabetes management.",
    expiryDate: "2024-12-10",
    patientId: "P-2024-001"
  },
  {
    id: "doc-003",
    fileName: "Chest X-Ray - Pneumonia Follow-up",
    documentType: "imaging" as const,
    fileUrl: "/documents/xray-003.jpg",
    fileSize: 5242880, // 5MB
    mimeType: "image/jpeg",
    uploadedBy: "Dr. Ravi Kumar",
    uploadDate: "2024-08-20",
    documentDate: "2024-08-19",
    issuingProvider: "Max Healthcare, Delhi",
    tags: ["X-Ray", "Chest", "Follow-up", "Clear"],
    isActive: true,
    sharedWith: [
      {
        doctorId: "dr-002",
        doctorName: "Dr. Sarah Johnson",
        sharedAt: "2024-08-21",
        accessLevel: "download" as const
      },
      {
        doctorId: "dr-003",
        doctorName: "Dr. Michael Chen",
        sharedAt: "2024-08-22",
        accessLevel: "full" as const
      }
    ],
    summary: "Chest X-ray showing clear lungs with complete resolution of previous pneumonia.",
    patientId: "P-2024-001"
  },
  {
    id: "doc-004",
    fileName: "Cardiology Consultation Notes",
    documentType: "consultation_notes" as const,
    fileUrl: "/documents/consultation-004.pdf",
    fileSize: 512000, // 512KB
    mimeType: "application/pdf",
    uploadedBy: "Dr. Anjali Gupta",
    uploadDate: "2024-07-15",
    documentDate: "2024-07-15",
    issuingProvider: "Asian Heart Institute, Mumbai",
    tags: ["Cardiology", "Hypertension", "ECG", "Normal"],
    isActive: true,
    sharedWith: [
      {
        doctorId: "dr-001",
        doctorName: "Dr. Amit Patel",
        sharedAt: "2024-07-16",
        accessLevel: "view" as const
      }
    ],
    summary: "Cardiology consultation for hypertension management. ECG normal, blood pressure controlled.",
    patientId: "P-2024-001"
  },
  {
    id: "doc-005",
    fileName: "Insurance Claim - Hospitalization",
    documentType: "insurance_claim" as const,
    fileUrl: "/documents/insurance-005.pdf",
    fileSize: 3145728, // 3MB
    mimeType: "application/pdf",
    uploadedBy: "Hospital Admin",
    uploadDate: "2024-06-01",
    documentDate: "2024-05-28",
    issuingProvider: "Star Health Insurance",
    tags: ["Insurance", "Hospitalization", "Approved", "₹45000"],
    isActive: true,
    sharedWith: [],
    summary: "Insurance claim for 3-day hospitalization. Claim amount ₹45,000 - Approved and processed.",
    expiryDate: "2025-05-28",
    patientId: "P-2024-001"
  },
  {
    id: "doc-006",
    fileName: "COVID-19 Vaccination Certificate",
    documentType: "vaccination_record" as const,
    fileUrl: "/documents/vaccine-006.pdf",
    fileSize: 256000, // 256KB
    mimeType: "application/pdf",
    uploadedBy: "Vaccination Center",
    uploadDate: "2024-01-15",
    documentDate: "2024-01-15",
    issuingProvider: "Government Hospital, Mumbai",
    tags: ["COVID-19", "Booster", "Covishield", "Complete"],
    isActive: true,
    sharedWith: [],
    summary: "COVID-19 booster vaccination (3rd dose) - Covishield vaccine administered.",
    patientId: "P-2024-001"
  }
];

export default function MedicalDocumentManagerExample() {
  return (
    <div className="p-6">
      <MedicalDocumentManager 
        patientId="P-2024-001"
        documents={sampleDocuments}
        onUploadDocument={(file, metadata) => console.log('Upload document:', { file, metadata })}
        onShareDocument={(documentId, shareInfo) => console.log('Share document:', { documentId, shareInfo })}
        onDownloadDocument={(documentId) => console.log('Download document:', documentId)}
        onDeleteDocument={(documentId) => console.log('Delete document:', documentId)}
      />
    </div>
  );
}