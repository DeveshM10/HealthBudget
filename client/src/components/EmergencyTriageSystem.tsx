import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AlertTriangle, 
  Clock, 
  Heart, 
  Phone, 
  MapPin,
  User,
  Activity,
  Zap,
  Shield,
  Ambulance,
  Hospital,
  Stethoscope,
  Timer
} from "lucide-react";

interface EmergencyCase {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  contactNumber: string;
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  emergencyType: 'critical' | 'urgent' | 'semi_urgent';
  triageLevel: 1 | 2 | 3 | 4 | 5; // 1 = Most critical
  symptoms: string[];
  vitalSigns: {
    consciousness: 'alert' | 'confused' | 'unconscious';
    breathing: 'normal' | 'difficulty' | 'absent';
    circulation: 'normal' | 'weak' | 'absent';
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
  };
  chiefComplaint: string;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'escalated';
  assignedDoctor?: string;
  responseTime?: number; // in minutes
  createdAt: string;
  estimatedArrivalTime?: string;
}

interface EmergencyTriageSystemProps {
  onCreateEmergency?: (emergencyCase: Partial<EmergencyCase>) => void;
  onAssignDoctor?: (caseId: string, doctorId: string) => void;
  onEscalate?: (caseId: string, escalationType: string) => void;
}

const triageLevels = [
  { level: 1, name: "Resuscitation", color: "bg-red-600 text-white", maxWait: "Immediate" },
  { level: 2, name: "Emergency", color: "bg-red-500 text-white", maxWait: "10 minutes" },
  { level: 3, name: "Urgent", color: "bg-orange-500 text-white", maxWait: "30 minutes" },
  { level: 4, name: "Semi-urgent", color: "bg-yellow-500 text-white", maxWait: "60 minutes" },
  { level: 5, name: "Non-urgent", color: "bg-green-500 text-white", maxWait: "120 minutes" }
];

const emergencySymptoms = [
  "Chest pain", "Difficulty breathing", "Severe bleeding", "Loss of consciousness",
  "Severe allergic reaction", "Stroke symptoms", "Severe burns", "Poisoning",
  "Severe trauma", "Cardiac arrest", "Seizure", "Severe abdominal pain"
];

export default function EmergencyTriageSystem({ 
  onCreateEmergency,
  onAssignDoctor,
  onEscalate 
}: EmergencyTriageSystemProps) {
  
  const [step, setStep] = useState(1);
  const [emergencyData, setEmergencyData] = useState<Partial<EmergencyCase>>({
    symptoms: [],
    medicalHistory: [],
    allergies: [],
    currentMedications: [],
    vitalSigns: {
      consciousness: 'alert',
      breathing: 'normal',
      circulation: 'normal'
    }
  });

  const [triageResult, setTriageResult] = useState<{
    level: number;
    urgency: string;
    recommendedActions: string[];
    estimatedResponseTime: string;
  } | null>(null);

  const updateEmergencyData = (field: string, value: any) => {
    setEmergencyData(prev => ({ ...prev, [field]: value }));
  };

  const updateVitalSigns = (field: string, value: any) => {
    setEmergencyData(prev => ({
      ...prev,
      vitalSigns: { ...prev.vitalSigns, [field]: value }
    }));
  };

  const addSymptom = (symptom: string) => {
    if (!emergencyData.symptoms?.includes(symptom)) {
      setEmergencyData(prev => ({
        ...prev,
        symptoms: [...(prev.symptoms || []), symptom]
      }));
    }
  };

  const removeSymptom = (symptom: string) => {
    setEmergencyData(prev => ({
      ...prev,
      symptoms: prev.symptoms?.filter(s => s !== symptom) || []
    }));
  };

  const calculateTriage = () => {
    let triageScore = 5; // Start with lowest priority
    
    // Critical symptoms
    const criticalSymptoms = [
      "Loss of consciousness", "Cardiac arrest", "Severe bleeding", 
      "Difficulty breathing", "Stroke symptoms"
    ];
    
    const urgentSymptoms = [
      "Chest pain", "Severe allergic reaction", "Seizure", "Severe burns"
    ];

    // Check vitals
    if (emergencyData.vitalSigns?.consciousness === 'unconscious' ||
        emergencyData.vitalSigns?.breathing === 'absent' ||
        emergencyData.vitalSigns?.circulation === 'absent') {
      triageScore = 1;
    } else if (emergencyData.vitalSigns?.consciousness === 'confused' ||
               emergencyData.vitalSigns?.breathing === 'difficulty' ||
               emergencyData.vitalSigns?.circulation === 'weak') {
      triageScore = Math.min(triageScore, 2);
    }

    // Check symptoms
    const hasCritical = emergencyData.symptoms?.some(symptom => 
      criticalSymptoms.some(critical => symptom.toLowerCase().includes(critical.toLowerCase()))
    );
    
    const hasUrgent = emergencyData.symptoms?.some(symptom => 
      urgentSymptoms.some(urgent => symptom.toLowerCase().includes(urgent.toLowerCase()))
    );

    if (hasSupported) {
      triageScore = Math.min(triageScore, 1);
    } else if (hasUrgent) {
      triageScore = Math.min(triageScore, 2);
    } else if (emergencyData.symptoms && emergencyData.symptoms.length > 0) {
      triageScore = Math.min(triageScore, 3);
    }

    const triageLevel = triageLevels.find(level => level.level === triageScore);
    
    let recommendedActions: string[] = [];
    let estimatedResponseTime = "";

    switch (triageScore) {
      case 1:
        recommendedActions = [
          "Immediate medical attention required",
          "Call ambulance immediately",
          "Prepare for emergency resuscitation",
          "Alert trauma team"
        ];
        estimatedResponseTime = "Immediate - Doctor assigned within 30 seconds";
        break;
      case 2:
        recommendedActions = [
          "Urgent medical consultation needed",
          "Fast-track to emergency specialist",
          "Monitor vitals continuously",
          "Prepare for potential escalation"
        ];
        estimatedResponseTime = "Within 5 minutes - Emergency specialist";
        break;
      case 3:
        recommendedActions = [
          "Priority consultation required",
          "Regular monitoring needed",
          "Schedule within 30 minutes",
          "General emergency physician"
        ];
        estimatedResponseTime = "Within 15 minutes - Available doctor";
        break;
      default:
        recommendedActions = [
          "Standard consultation",
          "Non-urgent assessment",
          "Regular monitoring",
          "Schedule within hour"
        ];
        estimatedResponseTime = "Within 60 minutes - General physician";
    }

    setTriageResult({
      level: triageScore,
      urgency: triageLevel?.name || "Unknown",
      recommendedActions,
      estimatedResponseTime
    });

    // Update emergency data with triage results
    setEmergencyData(prev => ({
      ...prev,
      triageLevel: triageScore as 1 | 2 | 3 | 4 | 5,
      emergencyType: triageScore <= 2 ? 'critical' : triageScore <= 3 ? 'urgent' : 'semi_urgent'
    }));
  };

  const handleSubmitEmergency = () => {
    const finalEmergencyData = {
      ...emergencyData,
      id: `EMG-${Date.now()}`,
      status: 'open' as const,
      createdAt: new Date().toISOString()
    };
    
    onCreateEmergency?.(finalEmergencyData);
    console.log('Emergency case created:', finalEmergencyData);
  };

  const getTriageColor = (level: number) => {
    const triageLevel = triageLevels.find(tl => tl.level === level);
    return triageLevel?.color || "bg-gray-500 text-white";
  };

  if (triageResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-6 w-6" />
              Emergency Triage Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Triage Level */}
            <div className={`p-6 rounded-lg ${getTriageColor(triageResult.level)}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    Level {triageResult.level}: {triageResult.urgency}
                  </h2>
                  <p className="text-lg opacity-90">
                    Maximum wait time: {triageLevels.find(tl => tl.level === triageResult.level)?.maxWait}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{triageResult.estimatedResponseTime}</div>
                  <div className="opacity-90">Estimated Response</div>
                </div>
              </div>
            </div>

            {/* Recommended Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Immediate Actions Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {triageResult.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Patient Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {emergencyData.patientName}</div>
                  <div><strong>Age:</strong> {emergencyData.age} years</div>
                  <div><strong>Contact:</strong> {emergencyData.contactNumber}</div>
                  <div><strong>Location:</strong> {emergencyData.location?.address}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Consciousness:</strong> {emergencyData.vitalSigns?.consciousness}</div>
                  <div><strong>Breathing:</strong> {emergencyData.vitalSigns?.breathing}</div>
                  <div><strong>Circulation:</strong> {emergencyData.vitalSigns?.circulation}</div>
                  {emergencyData.vitalSigns?.heartRate && (
                    <div><strong>Heart Rate:</strong> {emergencyData.vitalSigns.heartRate} bpm</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Emergency Actions */}
            <div className="flex gap-4">
              <Button 
                onClick={handleSubmitEmergency}
                className="bg-red-600 hover:bg-red-700"
                data-testid="button-submit-emergency"
              >
                <Ambulance className="h-4 w-4 mr-2" />
                Create Emergency Case
              </Button>
              
              {triageResult.level <= 2 && (
                <Button 
                  variant="outline"
                  className="border-red-300 text-red-700"
                  onClick={() => onEscalate?.(emergencyData.id || '', 'ambulance')}
                  data-testid="button-call-ambulance"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Ambulance
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={() => { setTriageResult(null); setStep(1); }}
                data-testid="button-restart-triage"
              >
                Start New Case
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-red-200">
        <CardHeader className="bg-red-50 border-b border-red-200">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-6 w-6" />
            Emergency Medical Triage System
          </CardTitle>
          <p className="text-red-600">
            24/7 Emergency Assessment • Response within minutes • Professional medical triage
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Step 1: Patient Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Patient Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patient-name">Patient Name *</Label>
                  <Input
                    id="patient-name"
                    value={emergencyData.patientName || ""}
                    onChange={(e) => updateEmergencyData('patientName', e.target.value)}
                    placeholder="Full name"
                    data-testid="input-patient-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={emergencyData.age || ""}
                    onChange={(e) => updateEmergencyData('age', parseInt(e.target.value))}
                    placeholder="Age in years"
                    data-testid="input-age"
                  />
                </div>
                
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={emergencyData.gender || ""} 
                    onValueChange={(value) => updateEmergencyData('gender', value)}
                  >
                    <SelectTrigger data-testid="select-gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="contact">Contact Number *</Label>
                  <Input
                    id="contact"
                    value={emergencyData.contactNumber || ""}
                    onChange={(e) => updateEmergencyData('contactNumber', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    data-testid="input-contact"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Current Location *</Label>
                <Textarea
                  id="location"
                  value={emergencyData.location?.address || ""}
                  onChange={(e) => updateEmergencyData('location', { address: e.target.value })}
                  placeholder="Full address or nearest landmark"
                  data-testid="textarea-location"
                />
              </div>
            </div>
          )}

          {/* Step 2: Emergency Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Emergency Assessment</h2>
              
              {/* Chief Complaint */}
              <div>
                <Label htmlFor="chief-complaint">What is the main problem? *</Label>
                <Textarea
                  id="chief-complaint"
                  value={emergencyData.chiefComplaint || ""}
                  onChange={(e) => updateEmergencyData('chiefComplaint', e.target.value)}
                  placeholder="Describe the main issue or emergency..."
                  data-testid="textarea-chief-complaint"
                />
              </div>
              
              {/* Symptoms */}
              <div>
                <Label className="text-base font-semibold mb-4 block">Emergency Symptoms</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {emergencySymptoms.map((symptom) => (
                    <Button
                      key={symptom}
                      variant={emergencyData.symptoms?.includes(symptom) ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => 
                        emergencyData.symptoms?.includes(symptom) 
                          ? removeSymptom(symptom) 
                          : addSymptom(symptom)
                      }
                      className="justify-start h-auto p-3 text-left"
                      data-testid={`symptom-${symptom.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
                
                {emergencyData.symptoms && emergencyData.symptoms.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Selected Symptoms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {emergencyData.symptoms.map((symptom) => (
                        <Badge key={symptom} variant="destructive" className="gap-1">
                          {symptom}
                          <button 
                            onClick={() => removeSymptom(symptom)}
                            className="ml-1 hover:text-white"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Vital Signs Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Consciousness Level</Label>
                  <Select 
                    value={emergencyData.vitalSigns?.consciousness || "alert"} 
                    onValueChange={(value) => updateVitalSigns('consciousness', value)}
                  >
                    <SelectTrigger data-testid="select-consciousness">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alert">Alert & Responsive</SelectItem>
                      <SelectItem value="confused">Confused/Disoriented</SelectItem>
                      <SelectItem value="unconscious">Unconscious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Breathing Status</Label>
                  <Select 
                    value={emergencyData.vitalSigns?.breathing || "normal"} 
                    onValueChange={(value) => updateVitalSigns('breathing', value)}
                  >
                    <SelectTrigger data-testid="select-breathing">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal Breathing</SelectItem>
                      <SelectItem value="difficulty">Difficulty Breathing</SelectItem>
                      <SelectItem value="absent">Not Breathing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Circulation/Pulse</Label>
                  <Select 
                    value={emergencyData.vitalSigns?.circulation || "normal"} 
                    onValueChange={(value) => updateVitalSigns('circulation', value)}
                  >
                    <SelectTrigger data-testid="select-circulation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal Pulse</SelectItem>
                      <SelectItem value="weak">Weak/Irregular Pulse</SelectItem>
                      <SelectItem value="absent">No Pulse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Medical History */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Medical History & Emergency Contact</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="allergies">Known Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={emergencyData.allergies?.join(', ') || ""}
                    onChange={(e) => updateEmergencyData('allergies', e.target.value.split(', ').filter(Boolean))}
                    placeholder="List any known allergies..."
                    data-testid="textarea-allergies"
                  />
                </div>
                
                <div>
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    value={emergencyData.currentMedications?.join(', ') || ""}
                    onChange={(e) => updateEmergencyData('currentMedications', e.target.value.split(', ').filter(Boolean))}
                    placeholder="List current medications..."
                    data-testid="textarea-medications"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="medical-history">Relevant Medical History</Label>
                <Textarea
                  id="medical-history"
                  value={emergencyData.medicalHistory?.join(', ') || ""}
                  onChange={(e) => updateEmergencyData('medicalHistory', e.target.value.split(', ').filter(Boolean))}
                  placeholder="Any relevant medical conditions, surgeries, or chronic diseases..."
                  data-testid="textarea-medical-history"
                />
              </div>
              
              {/* Emergency Contact */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <h3 className="font-semibold mb-3">Emergency Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="emergency-name">Contact Name</Label>
                    <Input
                      id="emergency-name"
                      value={emergencyData.emergencyContact?.name || ""}
                      onChange={(e) => updateEmergencyData('emergencyContact', {
                        ...emergencyData.emergencyContact,
                        name: e.target.value
                      })}
                      placeholder="Full name"
                      data-testid="input-emergency-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergency-relationship">Relationship</Label>
                    <Input
                      id="emergency-relationship"
                      value={emergencyData.emergencyContact?.relationship || ""}
                      onChange={(e) => updateEmergencyData('emergencyContact', {
                        ...emergencyData.emergencyContact,
                        relationship: e.target.value
                      })}
                      placeholder="e.g., spouse, parent"
                      data-testid="input-emergency-relationship"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergency-phone">Phone Number</Label>
                    <Input
                      id="emergency-phone"
                      value={emergencyData.emergencyContact?.phone || ""}
                      onChange={(e) => updateEmergencyData('emergencyContact', {
                        ...emergencyData.emergencyContact,
                        phone: e.target.value
                      })}
                      placeholder="+91 XXXXX XXXXX"
                      data-testid="input-emergency-phone"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                data-testid="button-back"
              >
                Back
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  className="bg-red-600 hover:bg-red-700"
                  data-testid="button-next"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={calculateTriage}
                  className="bg-red-600 hover:bg-red-700"
                  data-testid="button-assess-emergency"
                >
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Assess Emergency
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}