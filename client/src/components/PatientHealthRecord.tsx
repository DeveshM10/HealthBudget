import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  User, 
  Heart, 
  FileText, 
  Calendar, 
  Clock, 
  Shield,
  AlertTriangle,
  Plus,
  Edit,
  Download,
  Upload,
  Activity,
  Pill,
  Stethoscope,
  Users,
  Phone,
  MapPin
} from "lucide-react";

interface MedicalHistory {
  condition: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'chronic';
  treatingPhysician: string;
  notes: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  purpose: string;
  status: 'active' | 'completed' | 'discontinued';
}

interface Allergy {
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  confirmedDate: string;
}

interface VitalSigns {
  date: string;
  bloodPressure: { systolic: number; diastolic: number; };
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  bmi: number;
}

interface FamilyHistory {
  relation: string;
  conditions: string[];
  ageAtDiagnosis?: number;
  notes: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

interface PatientRecord {
  // Personal Information
  id: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  phoneNumber: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  emergencyContacts: EmergencyContact[];
  
  // Medical Information
  allergies: Allergy[];
  chronicConditions: string[];
  medicalHistory: MedicalHistory[];
  currentMedications: Medication[];
  familyHistory: FamilyHistory[];
  vitalSigns: VitalSigns[];
  
  // Insurance & Financial
  insuranceProvider?: string;
  policyNumber?: string;
  preferredBudgetRange: 'basic' | 'specialist' | 'premium';
  
  // Platform Information
  registrationDate: string;
  lastVisit: string;
  totalConsultations: number;
  preferredLanguages: string[];
}

interface PatientHealthRecordProps {
  patient: PatientRecord;
  isEditable?: boolean;
  onUpdateRecord?: (updates: Partial<PatientRecord>) => void;
  onAddMedication?: (medication: Medication) => void;
  onAddAllergy?: (allergy: Allergy) => void;
  onAddVitalSigns?: (vitals: VitalSigns) => void;
}

export default function PatientHealthRecord({ 
  patient, 
  isEditable = true,
  onUpdateRecord,
  onAddMedication,
  onAddAllergy,
  onAddVitalSigns
}: PatientHealthRecordProps) {
  
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleEdit = () => {
    setEditMode(!editMode);
    console.log('Edit mode toggled:', !editMode);
  };

  const handleSave = () => {
    setEditMode(false);
    onUpdateRecord?.(patient);
    console.log('Patient record saved');
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'chronic': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'resolved': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'discontinued': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'moderate': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'severe': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Patient Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" alt={patient.fullName} />
                <AvatarFallback className="text-xl font-semibold">
                  {patient.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{patient.fullName}</h1>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Patient ID: {patient.id}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Age:</span>
                    <span className="ml-2 font-medium">{patient.age} years</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="ml-2 font-medium capitalize">{patient.gender}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Blood Group:</span>
                    <span className="ml-2 font-medium">{patient.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget Range:</span>
                    <Badge variant="secondary" className="ml-2 capitalize">
                      {patient.preferredBudgetRange}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{patient.address.city}, {patient.address.state}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Last visit: {patient.lastVisit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                data-testid="button-download-record"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              {isEditable && (
                <Button 
                  variant={editMode ? "default" : "outline"}
                  size="sm"
                  onClick={editMode ? handleSave : handleEdit}
                  data-testid="button-edit-record"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editMode ? 'Save' : 'Edit'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical-history">History</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Consultations</span>
                  <span className="font-semibold">{patient.totalConsultations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Medications</span>
                  <span className="font-semibold">
                    {patient.currentMedications.filter(med => med.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Known Allergies</span>
                  <span className="font-semibold">{patient.allergies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chronic Conditions</span>
                  <span className="font-semibold">{patient.chronicConditions.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Current Medications Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {patient.currentMedications
                  .filter(med => med.status === 'active')
                  .slice(0, 3)
                  .map((medication, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium">{medication.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {medication.dosage} • {medication.frequency}
                      </div>
                    </div>
                  ))}
                {patient.currentMedications.filter(med => med.status === 'active').length > 3 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setActiveTab('medications')}
                    data-testid="button-view-all-medications"
                  >
                    View All ({patient.currentMedications.filter(med => med.status === 'active').length})
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Recent Vitals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Latest Vitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.vitalSigns.length > 0 ? (
                  <div className="space-y-3">
                    {(() => {
                      const latest = patient.vitalSigns[patient.vitalSigns.length - 1];
                      return (
                        <>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">BP:</span>
                              <span className="ml-2 font-medium">
                                {latest.bloodPressure.systolic}/{latest.bloodPressure.diastolic}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">HR:</span>
                              <span className="ml-2 font-medium">{latest.heartRate} bpm</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Weight:</span>
                              <span className="ml-2 font-medium">{latest.weight} kg</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">BMI:</span>
                              <span className="ml-2 font-medium">{latest.bmi}</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Recorded on {latest.date}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No vitals recorded yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chronic Conditions & Allergies Alert */}
          {(patient.chronicConditions.length > 0 || patient.allergies.length > 0) && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Medical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {patient.chronicConditions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-orange-800 mb-2">Chronic Conditions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {patient.chronicConditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="border-orange-300 text-orange-700">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.allergies.length > 0 && (
                  <div>
                    <h4 className="font-medium text-orange-800 mb-2">Allergies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.map((allergy, index) => (
                        <Badge 
                          key={index} 
                          className={`${getSeverityColor(allergy.severity)} border`}
                        >
                          {allergy.allergen} ({allergy.severity})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Medical History Tab */}
        <TabsContent value="medical-history" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Medical History</h2>
            {isEditable && (
              <Button size="sm" data-testid="button-add-medical-history">
                <Plus className="h-4 w-4 mr-2" />
                Add History
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {patient.medicalHistory.map((history, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{history.condition}</h3>
                      <p className="text-sm text-muted-foreground">
                        Diagnosed: {history.diagnosedDate} • Dr. {history.treatingPhysician}
                      </p>
                    </div>
                    <Badge className={getStatusColor(history.status)}>
                      {history.status}
                    </Badge>
                  </div>
                  {history.notes && (
                    <p className="text-sm">{history.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Current Medications</h2>
            {isEditable && (
              <Button size="sm" data-testid="button-add-medication">
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {patient.currentMedications.map((medication, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{medication.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {medication.dosage} • {medication.frequency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Prescribed by Dr. {medication.prescribedBy} • Started {medication.startDate}
                      </p>
                    </div>
                    <Badge className={getStatusColor(medication.status)}>
                      {medication.status}
                    </Badge>
                  </div>
                  <p className="text-sm"><strong>Purpose:</strong> {medication.purpose}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Allergies Tab */}
        <TabsContent value="allergies" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Known Allergies</h2>
            {isEditable && (
              <Button size="sm" data-testid="button-add-allergy">
                <Plus className="h-4 w-4 mr-2" />
                Add Allergy
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patient.allergies.map((allergy, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{allergy.allergen}</h3>
                      <p className="text-sm text-muted-foreground">
                        Confirmed: {allergy.confirmedDate}
                      </p>
                    </div>
                    <Badge className={getSeverityColor(allergy.severity)}>
                      {allergy.severity}
                    </Badge>
                  </div>
                  <p className="text-sm"><strong>Reaction:</strong> {allergy.reaction}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Vitals Tab */}
        <TabsContent value="vitals" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Vital Signs History</h2>
            {isEditable && (
              <Button size="sm" data-testid="button-add-vitals">
                <Plus className="h-4 w-4 mr-2" />
                Record Vitals
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {patient.vitalSigns.map((vitals, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Vitals - {vitals.date}</h3>
                    <Badge variant="outline">
                      BMI: {vitals.bmi}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Blood Pressure:</span>
                      <span className="ml-2 font-medium">
                        {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic} mmHg
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Heart Rate:</span>
                      <span className="ml-2 font-medium">{vitals.heartRate} bpm</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Temperature:</span>
                      <span className="ml-2 font-medium">{vitals.temperature}°F</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="ml-2 font-medium">{vitals.weight} kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Family History Tab */}
        <TabsContent value="family" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Family Medical History</h2>
            {isEditable && (
              <Button size="sm" data-testid="button-add-family-history">
                <Plus className="h-4 w-4 mr-2" />
                Add Family History
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {patient.familyHistory.map((family, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold capitalize">{family.relation}</h3>
                    {family.ageAtDiagnosis && (
                      <p className="text-sm text-muted-foreground">
                        Age at diagnosis: {family.ageAtDiagnosis} years
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <h4 className="text-sm font-medium mb-2">Conditions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {family.conditions.map((condition, idx) => (
                        <Badge key={idx} variant="outline">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {family.notes && (
                    <p className="text-sm">{family.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Emergency Contacts Tab */}
        <TabsContent value="emergency" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Emergency Contacts</h2>
            {isEditable && (
              <Button size="sm" data-testid="button-add-emergency-contact">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patient.emergencyContacts.map((contact, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {contact.relationship}
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{contact.phoneNumber}</span>
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Email:</span>
                          <span>{contact.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}