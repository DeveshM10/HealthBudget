import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Award, 
  GraduationCap, 
  Hospital,
  BookOpen,
  Calendar,
  Languages,
  Users,
  Heart,
  Stethoscope,
  Trophy,
  Video,
  MessageCircle
} from "lucide-react";

interface DoctorCredentials {
  medicalLicense: string;
  licenseState: string;
  licenseExpiry: string;
  boardCertifications: string[];
  fellowships: string[];
}

interface MedicalEducation {
  medicalSchool: string;
  residency: string;
  fellowship?: string;
  graduationYear: number;
}

interface ResearchPublication {
  title: string;
  journal: string;
  year: number;
  citations: number;
}

interface Award {
  title: string;
  organization: string;
  year: number;
}

interface DetailedDoctor {
  id: string;
  name: string;
  profilePhoto?: string;
  primarySpecialty: string;
  subSpecialties: string[];
  yearsOfExperience: number;
  consultationFee: number;
  rating: number;
  totalConsultations: number;
  totalReviews: number;
  // Credentials
  credentials: DoctorCredentials;
  education: MedicalEducation;
  // Professional Details
  hospitalAffiliations: string[];
  specialInterests: string[];
  languages: string[];
  // Location & Availability
  city: string;
  state: string;
  availableHours: {
    [key: string]: { start: string; end: string; }[];
  };
  nextAvailable: string;
  // Research & Publications
  researchPublications: ResearchPublication[];
  awards: Award[];
  // Professional Bio
  bio: string;
  // Patient Outcomes
  patientSatisfactionScore: number;
  averageResponseTime: string;
  // Emergency & Consultation Types
  providesEmergencyConsults: boolean;
  consultationTypes: string[];
}

interface EnhancedDoctorProfileProps {
  doctor: DetailedDoctor;
  onBookConsultation?: (doctor: DetailedDoctor) => void;
  onEmergencyConsult?: (doctor: DetailedDoctor) => void;
  onSendMessage?: (doctor: DetailedDoctor) => void;
}

export default function EnhancedDoctorProfile({ 
  doctor, 
  onBookConsultation, 
  onEmergencyConsult,
  onSendMessage 
}: EnhancedDoctorProfileProps) {
  
  const handleBookConsultation = () => {
    onBookConsultation?.(doctor);
    console.log('Book consultation with:', doctor.name);
  };

  const handleEmergencyConsult = () => {
    onEmergencyConsult?.(doctor);
    console.log('Emergency consultation with:', doctor.name);
  };

  const handleSendMessage = () => {
    onSendMessage?.(doctor);
    console.log('Send message to:', doctor.name);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={doctor.profilePhoto} alt={doctor.name} />
                <AvatarFallback className="text-2xl font-semibold">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-bold">Dr. {doctor.name}</h1>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  {doctor.providesEmergencyConsults && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Emergency Available
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-xl text-primary font-semibold">{doctor.primarySpecialty}</p>
                  {doctor.subSpecialties.length > 0 && (
                    <p className="text-muted-foreground">
                      Sub-specialties: {doctor.subSpecialties.join(', ')}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{doctor.rating}</span>
                    <span className="text-muted-foreground">({doctor.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{doctor.totalConsultations} consultations</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{doctor.yearsOfExperience} years experience</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{doctor.city}, {doctor.state}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Next available: {doctor.nextAvailable}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Fee & Actions */}
            <div className="lg:ml-auto space-y-4">
              <div className="text-center lg:text-right">
                <div className="text-3xl font-bold text-primary">₹{doctor.consultationFee}</div>
                <div className="text-sm text-muted-foreground">per consultation</div>
                <div className="text-xs text-green-600 mt-1">
                  ❤️ {doctor.patientSatisfactionScore}% patient satisfaction
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleBookConsultation}
                  className="w-full"
                  data-testid={`button-book-${doctor.id}`}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Book Consultation
                </Button>
                
                {doctor.providesEmergencyConsults && (
                  <Button 
                    variant="destructive"
                    onClick={handleEmergencyConsult}
                    className="w-full"
                    data-testid={`button-emergency-${doctor.id}`}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Emergency Consult
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={handleSendMessage}
                  className="w-full"
                  data-testid={`button-message-${doctor.id}`}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{doctor.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Specialization Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Special Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {doctor.specialInterests.map((interest, index) => (
                        <Badge key={index} variant="outline">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Languages</h4>
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doctor.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hospital className="h-5 w-5" />
                Hospital Affiliations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctor.hospitalAffiliations.map((hospital, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Hospital className="h-4 w-4 text-primary" />
                    <span>{hospital}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credentials Tab */}
        <TabsContent value="credentials" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Medical License
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">License Number</label>
                  <p className="font-mono text-lg">{doctor.credentials.medicalLicense}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">State</label>
                  <p>{doctor.credentials.licenseState}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                  <p>{doctor.credentials.licenseExpiry}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Board Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {doctor.credentials.boardCertifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {doctor.credentials.fellowships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Fellowship Training
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctor.credentials.fellowships.map((fellowship, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-semibold text-blue-900">{fellowship}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Medical Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-lg">Medical Degree</h3>
                  <p className="text-primary">{doctor.education.medicalSchool}</p>
                  <p className="text-sm text-muted-foreground">Graduated {doctor.education.graduationYear}</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg">Residency</h3>
                  <p className="text-blue-700">{doctor.education.residency}</p>
                </div>
                
                {doctor.education.fellowship && (
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-lg">Fellowship</h3>
                    <p className="text-green-700">{doctor.education.fellowship}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Research Tab */}
        <TabsContent value="research" className="space-y-6">
          {doctor.awards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Awards & Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctor.awards.map((award, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{award.title}</p>
                        <p className="text-sm text-muted-foreground">{award.organization}</p>
                      </div>
                      <Badge variant="outline">{award.year}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Research Publications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctor.researchPublications.map((publication, index) => (
                  <div key={index} className="p-4 border rounded-lg hover-elevate">
                    <h4 className="font-semibold">{publication.title}</h4>
                    <p className="text-sm text-muted-foreground">{publication.journal} • {publication.year}</p>
                    <p className="text-xs text-muted-foreground mt-1">{publication.citations} citations</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(doctor.availableHours).map(([day, slots]) => (
                  <div key={day} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium capitalize">{day}</span>
                    <div className="flex gap-2">
                      {slots.map((slot, index) => (
                        <Badge key={index} variant="outline">
                          {slot.start} - {slot.end}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consultation Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {doctor.consultationTypes.map((type, index) => (
                  <Badge key={index} variant="secondary">{type}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Feedback Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{doctor.patientSatisfactionScore}%</div>
                  <div className="text-sm text-green-600">Patient Satisfaction</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{doctor.averageResponseTime}</div>
                  <div className="text-sm text-blue-600">Avg Response Time</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">{doctor.totalReviews}</div>
                  <div className="text-sm text-purple-600">Total Reviews</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}