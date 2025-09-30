import CareCoordination from '../CareCoordination';

const sampleCareTeam = [
  {
    id: "ct-001",
    name: "Priya Sharma",
    role: "primary_physician" as const,
    specialty: "Internal Medicine",
    profilePhoto: "/images/doctor1.jpg",
    contactInfo: {
      phone: "+91 98765 43210",
      email: "priya.sharma@hospital.com",
      hospital: "Apollo Hospital, Mumbai"
    },
    joinedDate: "2024-01-15",
    isActive: true,
    lastActivity: "2 hours ago"
  },
  {
    id: "ct-002",
    name: "Rajesh Patel",
    role: "specialist" as const,
    specialty: "Cardiology",
    contactInfo: {
      phone: "+91 98765 43211",
      email: "rajesh.patel@hospital.com",
      hospital: "Fortis Hospital, Mumbai"
    },
    joinedDate: "2024-02-10",
    isActive: true,
    lastActivity: "1 day ago"
  },
  {
    id: "ct-003",
    name: "Anita Desai",
    role: "nurse" as const,
    specialty: "Cardiac Nursing",
    contactInfo: {
      phone: "+91 98765 43212",
      email: "anita.desai@hospital.com",
      hospital: "Apollo Hospital, Mumbai"
    },
    joinedDate: "2024-01-20",
    isActive: true,
    lastActivity: "30 minutes ago"
  }
];

const sampleReferrals = [
  {
    id: "ref-001",
    fromDoctorId: "ct-001",
    fromDoctorName: "Priya Sharma",
    toDoctorId: "ct-002",
    toDoctorName: "Rajesh Patel",
    specialty: "Cardiology",
    priority: "urgent" as const,
    reason: "Suspected coronary artery disease based on ECG findings",
    clinicalNotes: "Patient presents with chest pain on exertion, abnormal ECG showing ST-segment changes. Recommend stress test and echocardiogram.",
    attachments: ["ecg-report.pdf", "blood-test-results.pdf"],
    status: "pending" as const,
    requestedDate: "2024-09-15",
    appointmentDate: "2024-09-18"
  },
  {
    id: "ref-002",
    fromDoctorId: "ct-002",
    fromDoctorName: "Rajesh Patel",
    toDoctorId: "ct-004",
    toDoctorName: "Sarah Johnson",
    specialty: "Endocrinology",
    priority: "routine" as const,
    reason: "Diabetes management and insulin optimization",
    clinicalNotes: "Type 2 diabetes with suboptimal glycemic control. HbA1c 8.2%. Patient may benefit from insulin therapy adjustment.",
    attachments: ["hba1c-report.pdf"],
    status: "accepted" as const,
    requestedDate: "2024-09-10",
    appointmentDate: "2024-09-22"
  }
];

const sampleCommunications = [
  {
    id: "comm-001",
    subject: "Patient Care Plan Review - Rajesh Kumar",
    participants: ["ct-001", "ct-002", "ct-003"],
    messages: [
      {
        id: "msg-001",
        senderId: "ct-001",
        senderName: "Dr. Priya Sharma",
        content: "I'd like to discuss the care plan for Mr. Rajesh Kumar. His recent cardiac evaluation shows improvement, but we need to coordinate his diabetes management.",
        timestamp: "2024-09-15 10:30 AM",
        isUrgent: false
      },
      {
        id: "msg-002",
        senderId: "ct-002",
        senderName: "Dr. Rajesh Patel",
        content: "Cardiac status is stable. Echo shows improved EF. We can safely proceed with diabetes optimization. Suggest endocrinology consult.",
        timestamp: "2024-09-15 11:15 AM",
        isUrgent: false
      },
      {
        id: "msg-003",
        senderId: "ct-003",
        senderName: "Anita Desai",
        content: "Patient education completed. He's compliant with medications and monitoring. BP trending down nicely.",
        timestamp: "2024-09-15 02:20 PM",
        isUrgent: false
      }
    ],
    status: "active" as const,
    createdAt: "2024-09-15",
    lastActivity: "2 hours ago"
  },
  {
    id: "comm-002",
    subject: "Urgent: Blood Pressure Spike - Emergency Protocol",
    participants: ["ct-001", "ct-003"],
    messages: [
      {
        id: "msg-004",
        senderId: "ct-003",
        senderName: "Anita Desai",
        content: "Patient reporting severe headache and BP reading 180/110. Administered sublingual nitroglycerin as per protocol. Awaiting instructions.",
        timestamp: "2024-09-16 08:45 AM",
        isUrgent: true
      },
      {
        id: "msg-005",
        senderId: "ct-001",
        senderName: "Dr. Priya Sharma",
        content: "Thank you for quick response. Please administer IV hydralazine 10mg and monitor every 15 minutes. I'm en route to hospital. Call if BP doesn't respond in 30 minutes.",
        timestamp: "2024-09-16 08:52 AM",
        isUrgent: true
      }
    ],
    status: "active" as const,
    createdAt: "2024-09-16",
    lastActivity: "30 minutes ago"
  }
];

const sampleHandoffs = [
  {
    id: "ho-001",
    fromDoctorId: "ct-001",
    fromDoctorName: "Priya Sharma",
    toDoctorId: "ct-005",
    toDoctorName: "Michael Chen",
    patientCondition: "Stable, post-cardiac catheterization",
    handoffReason: "Vacation coverage - returning Monday",
    clinicalSummary: "65-year-old male, post-PCI with drug-eluting stent to LAD. Dual antiplatelet therapy initiated. No complications. Scheduled for follow-up echo in 1 week.",
    currentMedications: ["Aspirin 81mg", "Clopidogrel 75mg", "Atorvastatin 80mg", "Metoprolol 50mg"],
    pendingTasks: [
      "Review echo results due Friday",
      "Adjust beta-blocker dose based on heart rate",
      "Schedule cardiac rehab consultation"
    ],
    urgentAlerts: [
      "Watch for signs of stent thrombosis",
      "Patient allergic to contrast dye - documented"
    ],
    handoffDate: "2024-09-14",
    status: "accepted" as const
  }
];

export default function CareCoordinationExample() {
  return (
    <div className="p-6">
      <CareCoordination 
        patientId="P-2024-001"
        careTeam={sampleCareTeam}
        referrals={sampleReferrals}
        communications={sampleCommunications}
        handoffs={sampleHandoffs}
        onAddTeamMember={(member) => console.log('Add team member:', member)}
        onCreateReferral={(referral) => console.log('Create referral:', referral)}
        onSendMessage={(threadId, message, isUrgent) => console.log('Send message:', { threadId, message, isUrgent })}
        onHandoffPatient={(handoff) => console.log('Patient handoff:', handoff)}
      />
    </div>
  );
}