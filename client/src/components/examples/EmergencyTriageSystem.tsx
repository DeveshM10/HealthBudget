import EmergencyTriageSystem from '../EmergencyTriageSystem';

export default function EmergencyTriageSystemExample() {
  return (
    <div className="p-6">
      <EmergencyTriageSystem 
        onCreateEmergency={(emergencyCase) => console.log('Emergency case created:', emergencyCase)}
        onAssignDoctor={(caseId, doctorId) => console.log('Doctor assigned:', { caseId, doctorId })}
        onEscalate={(caseId, escalationType) => console.log('Emergency escalated:', { caseId, escalationType })}
      />
    </div>
  );
}