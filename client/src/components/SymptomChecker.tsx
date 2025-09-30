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
  Search, 
  Stethoscope, 
  AlertTriangle, 
  Clock, 
  User,
  Activity,
  Thermometer,
  Heart,
  Brain,
  Eye,
  Ear,
  Zap,
  ArrowRight
} from "lucide-react";

interface SymptomData {
  symptoms: string[];
  duration: string;
  severity: string;
  bodyPart: string;
  additionalInfo: string;
  age: string;
  gender: string;
}

interface TriageResult {
  urgencyLevel: 'emergency' | 'urgent' | 'moderate' | 'routine';
  recommendedSpecialists: string[];
  suggestedActions: string[];
  estimatedCost: {
    basic: number;
    specialist: number;
    premium: number;
  };
  disclaimer: string;
}

interface SymptomCheckerProps {
  onGetRecommendations?: (symptoms: SymptomData, results: TriageResult) => void;
  onBookConsultation?: (specialist: string) => void;
}

const commonSymptoms = [
  "Chest pain", "Shortness of breath", "Headache", "Fever", "Cough",
  "Abdominal pain", "Nausea", "Dizziness", "Fatigue", "Joint pain",
  "Back pain", "Sore throat", "Skin rash", "Vision problems", "Hearing issues"
];

const bodyParts = [
  { value: "head", label: "Head & Neck", icon: <Brain className="h-4 w-4" /> },
  { value: "chest", label: "Chest & Heart", icon: <Heart className="h-4 w-4" /> },
  { value: "abdomen", label: "Abdomen", icon: <Activity className="h-4 w-4" /> },
  { value: "back", label: "Back & Spine", icon: <User className="h-4 w-4" /> },
  { value: "limbs", label: "Arms & Legs", icon: <User className="h-4 w-4" /> },
  { value: "eyes", label: "Eyes", icon: <Eye className="h-4 w-4" /> },
  { value: "ears", label: "Ears", icon: <Ear className="h-4 w-4" /> },
  { value: "general", label: "General/Whole body", icon: <Activity className="h-4 w-4" /> }
];

export default function SymptomChecker({ onGetRecommendations, onBookConsultation }: SymptomCheckerProps) {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [formData, setFormData] = useState<SymptomData>({
    symptoms: [],
    duration: "",
    severity: "",
    bodyPart: "",
    additionalInfo: "",
    age: "",
    gender: ""
  });
  const [results, setResults] = useState<TriageResult | null>(null);

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom("");
    }
  };

  const updateFormData = (field: keyof SymptomData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && selectedSymptoms.length > 0) {
      updateFormData('symptoms', selectedSymptoms);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const generateTriageResults = (): TriageResult => {
    // Simple triage logic based on symptoms (in a real app, this would be AI-powered)
    const emergencySymptoms = ["chest pain", "severe headache", "difficulty breathing", "severe abdominal pain"];
    const urgentSymptoms = ["fever", "persistent cough", "severe pain"];
    
    const hasEmergencySymptom = selectedSymptoms.some(symptom => 
      emergencySymptoms.some(emergency => symptom.toLowerCase().includes(emergency))
    );
    
    const hasUrgentSymptom = selectedSymptoms.some(symptom => 
      urgentSymptoms.some(urgent => symptom.toLowerCase().includes(urgent))
    );

    let urgencyLevel: TriageResult['urgencyLevel'];
    let recommendedSpecialists: string[];
    let suggestedActions: string[];

    if (hasEmergencySymptom || formData.severity === "severe") {
      urgencyLevel = "emergency";
      recommendedSpecialists = ["Emergency Medicine", "Cardiologist", "Internal Medicine"];
      suggestedActions = [
        "Seek immediate medical attention",
        "Consider emergency room visit",
        "Do not delay treatment"
      ];
    } else if (hasUrgentSymptom || formData.severity === "moderate") {
      urgencyLevel = "urgent";
      recommendedSpecialists = ["Internal Medicine", "Family Medicine", "Specialist consultation"];
      suggestedActions = [
        "Schedule consultation within 24-48 hours",
        "Monitor symptoms closely",
        "Consider urgent care if symptoms worsen"
      ];
    } else {
      urgencyLevel = "routine";
      recommendedSpecialists = ["General Physician", "Family Medicine"];
      suggestedActions = [
        "Schedule consultation within a week",
        "Monitor symptoms",
        "Practice self-care measures"
      ];
    }

    return {
      urgencyLevel,
      recommendedSpecialists,
      suggestedActions,
      estimatedCost: {
        basic: urgencyLevel === "emergency" ? 2000 : urgencyLevel === "urgent" ? 800 : 500,
        specialist: urgencyLevel === "emergency" ? 3500 : urgencyLevel === "urgent" ? 1500 : 1000,
        premium: urgencyLevel === "emergency" ? 5000 : urgencyLevel === "urgent" ? 2500 : 1800
      },
      disclaimer: "This is not a medical diagnosis. Please consult with a healthcare professional for proper evaluation and treatment."
    };
  };

  const handleGetRecommendations = () => {
    const triageResults = generateTriageResults();
    setResults(triageResults);
    onGetRecommendations?.(formData, triageResults);
    console.log('Symptom analysis:', { formData, results: triageResults });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-50 text-red-700 border-red-200';
      case 'urgent': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'moderate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      case 'urgent': return <Clock className="h-4 w-4" />;
      case 'moderate': return <Activity className="h-4 w-4" />;
      default: return <Stethoscope className="h-4 w-4" />;
    }
  };

  if (results) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Symptom Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Urgency Level */}
            <div className={`p-4 rounded-lg border ${getUrgencyColor(results.urgencyLevel)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getUrgencyIcon(results.urgencyLevel)}
                <span className="font-semibold text-lg capitalize">{results.urgencyLevel} Priority</span>
              </div>
              <p className="text-sm">Based on your symptoms, this appears to be a {results.urgencyLevel} priority case.</p>
            </div>

            {/* Recommended Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommended Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.suggestedActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommended Specialists</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.recommendedSpecialists.map((specialist, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                        <span className="text-sm font-medium">{specialist}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onBookConsultation?.(specialist)}
                          data-testid={`button-book-${specialist.replace(/\\s+/g, '-').toLowerCase()}`}
                        >
                          Book Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cost Estimates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estimated Consultation Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-700">₹{results.estimatedCost.basic}</div>
                    <div className="text-sm text-green-600">Basic Care</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">₹{results.estimatedCost.specialist}</div>
                    <div className="text-sm text-blue-600">Specialist Care</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-700">₹{results.estimatedCost.premium}</div>
                    <div className="text-sm text-purple-600">Premium Care</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Medical Disclaimer:</strong> {results.disclaimer}
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => { setResults(null); setStep(1); }} variant="outline">
                Check Other Symptoms
              </Button>
              <Button onClick={() => onBookConsultation?.('General Physician')}>
                Book Consultation Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            AI-Powered Symptom Checker
          </CardTitle>
          <p className="text-muted-foreground">
            Get personalized doctor recommendations based on your symptoms
          </p>
        </CardHeader>
        <CardContent>
          {/* Step 1: Symptom Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-lg font-semibold mb-4 block">What symptoms are you experiencing?</Label>
                
                {/* Common Symptoms */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Common Symptoms</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonSymptoms.map((symptom) => (
                      <Button
                        key={symptom}
                        variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                        size="sm"
                        onClick={() => addSymptom(symptom)}
                        className="justify-start h-auto p-3"
                        data-testid={`symptom-${symptom.replace(/\\s+/g, '-').toLowerCase()}`}
                      >
                        {symptom}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Symptom */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Add Custom Symptom</h3>
                  <div className="flex gap-2">
                    <Input
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      placeholder="Describe your symptom..."
                      data-testid="input-custom-symptom"
                    />
                    <Button onClick={addCustomSymptom} variant="outline" data-testid="button-add-symptom">
                      Add
                    </Button>
                  </div>
                </div>

                {/* Selected Symptoms */}
                {selectedSymptoms.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Selected Symptoms</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <Badge 
                          key={symptom} 
                          variant="secondary" 
                          className="gap-1"
                        >
                          {symptom}
                          <button 
                            onClick={() => removeSymptom(symptom)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="duration">How long have you had these symptoms?</Label>
                  <Select value={formData.duration} onValueChange={(value) => updateFormData('duration', value)}>
                    <SelectTrigger data-testid="select-duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="few-hours">A few hours</SelectItem>
                      <SelectItem value="1-day">1 day</SelectItem>
                      <SelectItem value="2-3-days">2-3 days</SelectItem>
                      <SelectItem value="1-week">About a week</SelectItem>
                      <SelectItem value="few-weeks">A few weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="severity">How severe are your symptoms?</Label>
                  <Select value={formData.severity} onValueChange={(value) => updateFormData('severity', value)}>
                    <SelectTrigger data-testid="select-severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild - Doesn't interfere with daily activities</SelectItem>
                      <SelectItem value="moderate">Moderate - Some impact on daily activities</SelectItem>
                      <SelectItem value="severe">Severe - Significantly impacts daily life</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="body-part">Which part of your body is affected?</Label>
                  <Select value={formData.bodyPart} onValueChange={(value) => updateFormData('bodyPart', value)}>
                    <SelectTrigger data-testid="select-body-part">
                      <SelectValue placeholder="Select body part" />
                    </SelectTrigger>
                    <SelectContent>
                      {bodyParts.map((part) => (
                        <SelectItem key={part.value} value={part.value}>
                          <div className="flex items-center gap-2">
                            {part.icon}
                            {part.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
                    <SelectTrigger data-testid="select-gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData('age', e.target.value)}
                  placeholder="Enter your age"
                  data-testid="input-age"
                />
              </div>

              <div>
                <Label htmlFor="additional-info">Additional Information</Label>
                <Textarea
                  id="additional-info"
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                  placeholder="Any additional details about your symptoms, triggers, or medical history..."
                  data-testid="textarea-additional-info"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} data-testid="button-back">
                Back
              </Button>
            )}
            
            <div className="ml-auto flex gap-2">
              {step < 2 ? (
                <Button 
                  onClick={handleNext} 
                  disabled={selectedSymptoms.length === 0}
                  data-testid="button-next"
                >
                  Next: Add Details
                </Button>
              ) : (
                <Button onClick={handleGetRecommendations} data-testid="button-get-recommendations">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Get Recommendations
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}