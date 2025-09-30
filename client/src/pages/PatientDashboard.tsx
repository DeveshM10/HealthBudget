import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar,
  Clock,
  FileText,
  Heart,
  Activity,
  User,
  Settings,
  Bell,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  MessageCircle,
  Video,
  Phone,
  Loader,
  AlertCircle,
  X
} from "lucide-react";
import type { 
  User as UserType, 
  HealthMetric, 
  MedicalRecord, 
  Allergy, 
  Condition, 
  Medication, 
  Appointment 
} from "@shared/types";
import { getPatientBookings, cancelBooking } from "@/services/BookingService";

// Mock data for health metrics
const mockHealthMetrics: HealthMetric[] = [
  {
    id: 1,
    name: "Heart Rate",
    value: "72",
    unit: "bpm",
    trend: "stable",
    icon: Heart,
  },
  {
    id: 2,
    name: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    trend: "improving",
    icon: Activity,
  },
  {
    id: 3,
    name: "Steps",
    value: "8,542",
    unit: "steps",
    trend: "increasing",
    icon: Activity,
  },
  {
    id: 4,
    name: "Sleep",
    value: "7.5",
    unit: "hours",
    trend: "decreasing",
    icon: Clock,
  },
];

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [location, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth<{ userType: string; id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessingCancel, setIsProcessingCancel] = useState<string | null>(null);
  
  // Mock data for allergies
  const mockAllergies: Allergy[] = [
    { 
      id: '1', 
      name: 'Penicillin', 
      reaction: 'Rash', 
      severity: 'moderate' as const,
      notes: 'Prescribed in 2020'
    },
    { 
      id: '2', 
      name: 'Peanuts', 
      reaction: 'Anaphylaxis', 
      severity: 'severe' as const,
      notes: 'Carry EpiPen'
    }
  ];
  
  // Mock data for conditions
  const mockConditions: Condition[] = [
    { 
      id: '1', 
      name: 'Type 2 Diabetes', 
      diagnosisDate: '2020-05-15', 
      status: 'chronic' as const,
      notes: 'Controlled with medication'
    },
    { 
      id: '2', 
      name: 'Hypertension', 
      diagnosisDate: '2019-11-22', 
      status: 'active' as const,
      notes: 'On medication'
    }
  ];
  
  // Handle authentication and role-based redirects in useEffect
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Redirect to login if not authenticated
        setLocation('/');
        return;
      }
      if (user.userType && user.userType !== 'patient') {
        // Redirect non-patients to appropriate page
        // For now, redirect to home - could be doctor dashboard later
        setLocation('/');
        return;
      }
    }
  }, [authLoading, user, setLocation]);
  
  // Return null during redirects
  if (!authLoading && (!user || (user.userType && user.userType !== 'patient'))) {
    return null;
  }

  // Navigation handlers
  const handleFindDoctor = () => {
    setLocation('/');
  };

  const handleEmergency = () => {
    console.log('Emergency button clicked');
    // TODO: Implement emergency flow
  };

  const handleUploadDocument = () => {
    console.log('Upload document clicked');
    // TODO: Implement document upload
  };

  const handleBookCheckup = () => {
    setLocation('/');
  };

  // Fetch patient data using authenticated user ID
  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: ['/api/patients/user', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/patients/user/${user?.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          // Patient profile doesn't exist yet, this is expected for new users
          return null;
        }
        throw new Error('Failed to fetch patient data');
      }
      return response.json() as Promise<Patient>;
    },
    enabled: !!user?.id && user?.userType === 'patient'
  });

  // Fetch consultations
  const { data: consultations = [], isLoading: consultationsLoading } = useQuery({
    queryKey: ['/api/consultations/patient', patient?.id],
    queryFn: async () => {
      const response = await fetch(`/api/consultations/patient/${patient?.id}`);
      if (!response.ok) throw new Error('Failed to fetch consultations');
      return response.json() as Promise<Consultation[]>;
    },
    enabled: !!patient?.id
  });
  
  // Fetch bookings using BookingService
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return getPatientBookings(user.id);
    },
    enabled: !!user?.id
  });
  
  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    try {
      setIsProcessingCancel(bookingId);
      await cancelBooking(bookingId);
      
      // Refresh bookings data
      queryClient.invalidateQueries({ queryKey: ['bookings', user?.id] });
      
      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been successfully cancelled.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Cancellation failed",
        description: "There was an error cancelling your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingCancel(null);
    }
  };

  // Fetch medical documents
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ['/api/medical-documents/patient', patient?.id],
    queryFn: async () => {
      const response = await fetch(`/api/medical-documents/patient/${patient?.id}`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json() as Promise<MedicalDocument[]>;
    },
    enabled: !!patient?.id
  });

  // Calculate statistics from real data
  const upcomingConsultations = consultations.filter(c => 
    c.status === 'scheduled' && new Date(c.scheduledAt) > new Date()
  );
  const completedConsultations = consultations.filter(c => c.status === 'completed');
  
  // Quick stats based on real data
  const quickStats = {
    consultations: consultations.length,
    upcoming: upcomingConsultations.length,
    documents: documents.length,
    completed: completedConsultations.length
  };

  if (authLoading || patientLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Use real patient data or fallback to user data for display
  const displayPatient = patient || {
    fullName: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Patient',
    dateOfBirth: '1990-01-01',
    gender: 'Unknown',
    phoneNumber: 'Not provided',
    city: 'Unknown',
    state: 'Unknown',
    bloodGroup: 'Unknown',
    allergies: [],
    chronicConditions: [],
    preferredBudgetRange: 'basic'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.profileImageUrl || undefined} />
                <AvatarFallback className="text-lg">
                  {displayPatient.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {displayPatient.fullName}</h1>
                <p className="text-muted-foreground">Manage your health journey</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-settings">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{quickStats.upcoming}</p>
                  <p className="text-xs text-muted-foreground">Consultation{quickStats.upcoming !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documents</p>
                  <p className="text-2xl font-bold">{quickStats.documents}</p>
                  <p className="text-xs text-muted-foreground">Records</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Health Score</p>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-xs text-muted-foreground">Good</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{quickStats.completed}</p>
                  <p className="text-xs text-muted-foreground">Consultation{quickStats.completed !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="health">Health Metrics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Consultations */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Upcoming Consultations</CardTitle>
                  <Button variant="outline" size="sm" data-testid="button-view-all-consultations">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {consultationsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading consultations...</span>
                    </div>
                  ) : upcomingConsultations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No upcoming consultations</p>
                      <Button className="mt-4" onClick={handleFindDoctor} data-testid="button-book-consultation">
                        Book Consultation
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingConsultations.slice(0, 3).map((consultation) => (
                        <div key={consultation.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Video className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">Consultation</h4>
                            <p className="text-sm text-muted-foreground">{consultation.consultationType}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(consultation.scheduledAt).toLocaleDateString()} at {new Date(consultation.scheduledAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge>Scheduled</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Documents */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Documents</CardTitle>
                  <Button variant="outline" size="sm" data-testid="button-view-all-documents">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {documentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading documents...</span>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No documents uploaded</p>
                      <Button className="mt-4" onClick={handleUploadDocument} data-testid="button-upload-first-document">
                        Upload Document
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {documents.slice(0, 3).map((document) => (
                        <div key={document.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{document.fileName}</h4>
                            <p className="text-sm text-muted-foreground">{document.issuingProvider || 'Unknown Provider'}</p>
                            <p className="text-xs text-muted-foreground">{document.documentDate}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" data-testid={`button-view-document-${document.id}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" data-testid={`button-download-document-${document.id}`}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Health Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Health Score</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Blood Group</p>
                        <p className="font-semibold">{displayPatient.bloodGroup}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gender</p>
                        <p className="font-semibold">{displayPatient.gender}</p>
                      </div>
                    </div>

                    {displayPatient.allergies && displayPatient.allergies.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Allergies</p>
                        <div className="flex flex-wrap gap-2">
                          {displayPatient.allergies.map((allergy, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex flex-col gap-2" onClick={handleFindDoctor} data-testid="button-find-doctor">
                      <Search className="h-6 w-6" />
                      <span className="text-sm">Find Doctor</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={handleEmergency} data-testid="button-emergency">
                      <AlertCircle className="h-6 w-6" />
                      <span className="text-sm">Emergency</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={handleUploadDocument} data-testid="button-upload-document">
                      <Plus className="h-6 w-6" />
                      <span className="text-sm">Upload Doc</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={handleBookCheckup} data-testid="button-book-checkup">
                      <Calendar className="h-6 w-6" />
                      <span className="text-sm">Book Checkup</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="consultations">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Consultations</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button size="sm" onClick={handleFindDoctor} data-testid="button-new-consultation" className="gap-1">
                    <Plus className="h-4 w-4" />
                    New Consultation
                  </Button>
                </div>
              </div>
              
              {/* Tabs for different consultation statuses */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  {(consultationsLoading || bookingsLoading) ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading appointments...</span>
                    </div>
                  ) : (consultations.length === 0 && bookings.length === 0) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No appointments found</p>
                      <Button className="mt-4" onClick={handleFindDoctor} data-testid="button-book-consultation">
                        Book Appointment
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Display bookings */}
                      {bookings.map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  {booking.consultationType === 'video' ? (
                                    <Video className="h-5 w-5 text-blue-600" />
                                  ) : (
                                    <Phone className="h-5 w-5 text-green-600" />
                                  )}
                                  <h3 className="font-semibold">{booking.consultationType.charAt(0).toUpperCase() + booking.consultationType.slice(1)} Consultation</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                </p>
                                <p className="text-sm mt-2">
                                  <span className="font-medium">Doctor ID:</span> {booking.doctorId}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Symptoms:</span> {booking.symptoms || 'Not specified'}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Amount:</span> ₹{booking.paymentAmount}
                                </p>
                              </div>
                              <div className="flex flex-col md:items-end gap-2">
                                <Badge className={
                                  booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                                <div className="flex gap-2 mt-2">
                                  {booking.status === 'confirmed' && (
                                    <>
                                      <Button variant="outline" size="sm" className="gap-1">
                                        <Video className="h-4 w-4" />
                                        Join
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="gap-1 text-red-600 hover:text-red-700"
                                        onClick={() => handleCancelBooking(booking.id)}
                                        disabled={isProcessingCancel === booking.id}
                                      >
                                        {isProcessingCancel === booking.id ? (
                                          <Loader className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <X className="h-4 w-4" />
                                        )}
                                        {isProcessingCancel === booking.id ? 'Cancelling...' : 'Cancel'}
                                      </Button>
                                    </>
                                  )}
                                  {booking.status === 'completed' && (
                                    <Button variant="outline" size="sm" className="gap-1">
                                      <FileText className="h-4 w-4" />
                                      View Report
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {/* Display consultations */}
                      {consultations.map((consultation) => (
                        <Card key={consultation.id}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  {consultation.consultationType === 'video' ? (
                                    <Video className="h-5 w-5 text-blue-600" />
                                  ) : consultation.consultationType === 'audio' ? (
                                    <Phone className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <MessageCircle className="h-5 w-5 text-purple-600" />
                                  )}
                                  <h3 className="font-semibold">{consultation.consultationType.charAt(0).toUpperCase() + consultation.consultationType.slice(1)} Consultation</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {new Date(consultation.scheduledAt).toLocaleDateString()} at {new Date(consultation.scheduledAt).toLocaleTimeString()}
                                </p>
                                <p className="text-sm mt-2">
                                  <span className="font-medium">Doctor:</span> {consultation.doctorName || 'Unknown'}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Reason:</span> {consultation.reason || 'Not specified'}
                                </p>
                              </div>
                              <div className="flex flex-col md:items-end gap-2">
                                <Badge className={
                                  consultation.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                  consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }>
                                  {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                                </Badge>
                                <div className="flex gap-2 mt-2">
                                  {consultation.status === 'scheduled' && (
                                    <>
                                      <Button variant="outline" size="sm" className="gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Reschedule
                                      </Button>
                                      <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700">
                                        Cancel
                                      </Button>
                                    </>
                                  )}
                                  {consultation.status === 'completed' && (
                                    <Button variant="outline" size="sm" className="gap-1">
                                      <FileText className="h-4 w-4" />
                                      View Report
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Upcoming tab */}
                <TabsContent value="upcoming" className="mt-4">
                  {(consultationsLoading || bookingsLoading) ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading appointments...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.filter(b => b.status === 'confirmed').length === 0 && 
                       upcomingConsultations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No upcoming appointments</p>
                          <Button className="mt-4" onClick={handleFindDoctor}>
                            Book Appointment
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Display upcoming bookings */}
                          {bookings
                            .filter(b => b.status === 'confirmed')
                            .map((booking) => (
                              <Card key={booking.id}>
                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        {booking.consultationType === 'video' ? (
                                          <Video className="h-5 w-5 text-blue-600" />
                                        ) : (
                                          <Phone className="h-5 w-5 text-green-600" />
                                        )}
                                        <h3 className="font-semibold">{booking.consultationType.charAt(0).toUpperCase() + booking.consultationType.slice(1)} Consultation</h3>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                      </p>
                                      <p className="text-sm mt-2">
                                        <span className="font-medium">Doctor ID:</span> {booking.doctorId}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">Symptoms:</span> {booking.symptoms || 'Not specified'}
                                      </p>
                                    </div>
                                    <div className="flex flex-col md:items-end gap-2">
                                      <Badge className="bg-blue-100 text-blue-800">
                                        Confirmed
                                      </Badge>
                                      <div className="flex gap-2 mt-2">
                                        <Button variant="outline" size="sm" className="gap-1">
                                          <Video className="h-4 w-4" />
                                          Join
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="gap-1 text-red-600 hover:text-red-700"
                                          onClick={() => handleCancelBooking(booking.id)}
                                          disabled={isProcessingCancel === booking.id}
                                        >
                                          {isProcessingCancel === booking.id ? (
                                            <Loader className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <X className="h-4 w-4" />
                                          )}
                                          {isProcessingCancel === booking.id ? 'Cancelling...' : 'Cancel'}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                          ))}
                          
                          {/* Display upcoming consultations */}
                          {upcomingConsultations.map((consultation) => (
                            <Card key={consultation.id}>
                              <CardContent className="p-6">
                                {/* Consultation content - same as in the "all" tab */}
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      {consultation.consultationType === 'video' ? (
                                        <Video className="h-5 w-5 text-blue-600" />
                                      ) : consultation.consultationType === 'audio' ? (
                                        <Phone className="h-5 w-5 text-green-600" />
                                      ) : (
                                        <MessageCircle className="h-5 w-5 text-purple-600" />
                                      )}
                                      <h3 className="font-semibold">{consultation.consultationType.charAt(0).toUpperCase() + consultation.consultationType.slice(1)} Consultation</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {new Date(consultation.scheduledAt).toLocaleDateString()} at {new Date(consultation.scheduledAt).toLocaleTimeString()}
                                    </p>
                                    <p className="text-sm mt-2">
                                      <span className="font-medium">Doctor:</span> {consultation.doctorName || 'Unknown'}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Reason:</span> {consultation.reason || 'Not specified'}
                                    </p>
                                  </div>
                                  <div className="flex flex-col md:items-end gap-2">
                                    <Badge className="bg-blue-100 text-blue-800">
                                      Scheduled
                                    </Badge>
                                    <div className="flex gap-2 mt-2">
                                      <Button variant="outline" size="sm" className="gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Reschedule
                                      </Button>
                                      <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700">
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                {/* Completed tab */}
                <TabsContent value="completed" className="mt-4">
                  {(consultationsLoading || bookingsLoading) ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading appointments...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.filter(b => b.status === 'completed').length === 0 && 
                       completedConsultations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No completed appointments</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Display completed bookings */}
                          {bookings
                            .filter(b => b.status === 'completed')
                            .map((booking) => (
                              <Card key={booking.id}>
                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        {booking.consultationType === 'video' ? (
                                          <Video className="h-5 w-5 text-blue-600" />
                                        ) : (
                                          <Phone className="h-5 w-5 text-green-600" />
                                        )}
                                        <h3 className="font-semibold">{booking.consultationType.charAt(0).toUpperCase() + booking.consultationType.slice(1)} Consultation</h3>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                      </p>
                                      <p className="text-sm mt-2">
                                        <span className="font-medium">Doctor ID:</span> {booking.doctorId}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">Symptoms:</span> {booking.symptoms || 'Not specified'}
                                      </p>
                                    </div>
                                    <div className="flex flex-col md:items-end gap-2">
                                      <Badge className="bg-green-100 text-green-800">
                                        Completed
                                      </Badge>
                                      <div className="flex gap-2 mt-2">
                                        <Button variant="outline" size="sm" className="gap-1">
                                          <FileText className="h-4 w-4" />
                                          View Report
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                          ))}
                          
                          {/* Display completed consultations */}
                          {completedConsultations.map((consultation) => (
                            <Card key={consultation.id}>
                              <CardContent className="p-6">
                                {/* Consultation content - same as in the "all" tab */}
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      {consultation.consultationType === 'video' ? (
                                        <Video className="h-5 w-5 text-blue-600" />
                                      ) : consultation.consultationType === 'audio' ? (
                                        <Phone className="h-5 w-5 text-green-600" />
                                      ) : (
                                        <MessageCircle className="h-5 w-5 text-purple-600" />
                                      )}
                                      <h3 className="font-semibold">{consultation.consultationType.charAt(0).toUpperCase() + consultation.consultationType.slice(1)} Consultation</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {new Date(consultation.scheduledAt).toLocaleDateString()} at {new Date(consultation.scheduledAt).toLocaleTimeString()}
                                    </p>
                                    <p className="text-sm mt-2">
                                      <span className="font-medium">Doctor:</span> {consultation.doctorName || 'Unknown'}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Reason:</span> {consultation.reason || 'Not specified'}
                                    </p>
                                  </div>
                                  <div className="flex flex-col md:items-end gap-2">
                                    <Badge className="bg-green-100 text-green-800">
                                      Completed
                                    </Badge>
                                    <div className="flex gap-2 mt-2">
                                      <Button variant="outline" size="sm" className="gap-1">
                                        <FileText className="h-4 w-4" />
                                        View Report
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                {/* Cancelled tab */}
                <TabsContent value="cancelled" className="mt-4">
                  {(consultationsLoading || bookingsLoading) ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading appointments...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.filter(b => b.status === 'cancelled').length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <X className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No cancelled appointments</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Display cancelled bookings */}
                          {bookings
                            .filter(b => b.status === 'cancelled')
                            .map((booking) => (
                              <Card key={booking.id}>
                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        {booking.consultationType === 'video' ? (
                                          <Video className="h-5 w-5 text-blue-600" />
                                        ) : (
                                          <Phone className="h-5 w-5 text-green-600" />
                                        )}
                                        <h3 className="font-semibold">{booking.consultationType.charAt(0).toUpperCase() + booking.consultationType.slice(1)} Consultation</h3>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                      </p>
                                      <p className="text-sm mt-2">
                                        <span className="font-medium">Doctor ID:</span> {booking.doctorId}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">Symptoms:</span> {booking.symptoms || 'Not specified'}
                                      </p>
                                    </div>
                                    <div className="flex flex-col md:items-end gap-2">
                                      <Badge className="bg-red-100 text-red-800">
                                        Cancelled
                                      </Badge>
                                      <div className="flex gap-2 mt-2">
                                        <Button variant="outline" size="sm" className="gap-1" onClick={handleFindDoctor}>
                                          <Plus className="h-4 w-4" />
                                          Book New
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                {/* Test Reports Tab */}
                <TabsContent value="reports" className="mt-4">
                  {documentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading test reports...</span>
                    </div>
                  ) : documents.filter(d => d.documentType === 'test_report').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No test reports found</p>
                      <Button className="mt-4" data-testid="button-upload-report">
                        Upload Test Report
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {documents
                        .filter(d => d.documentType === 'test_report')
                        .map((document) => (
                          <div key={document.id} className="flex items-center gap-4 p-6 border rounded-lg">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{document.fileName}</h4>
                              <p className="text-muted-foreground">{document.issuingProvider}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span>{new Date(document.documentDate).toLocaleDateString()}</span>
                                <Badge variant="outline">Test Report</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" data-testid={`button-view-document-${document.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" data-testid={`button-download-document-${document.id}`}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Prescriptions Tab */}
                <TabsContent value="prescriptions" className="mt-4">
                  {documentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading prescriptions...</span>
                    </div>
                  ) : documents.filter(d => d.documentType === 'prescription').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No prescriptions found</p>
                      <Button className="mt-4" data-testid="button-upload-prescription">
                        Upload Prescription
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {documents
                        .filter(d => d.documentType === 'prescription')
                        .map((document) => (
                          <div key={document.id} className="flex items-center gap-4 p-6 border rounded-lg">
                            <div className="p-3 bg-green-100 rounded-lg">
                              <FileText className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{document.fileName}</h4>
                              <p className="text-muted-foreground">{document.issuingProvider}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span>{new Date(document.documentDate).toLocaleDateString()}</span>
                                <Badge variant="outline">Prescription</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" data-testid={`button-view-document-${document.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" data-testid={`button-download-document-${document.id}`}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Other Documents Tab */}
                <TabsContent value="other" className="mt-4">
                  {documentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading other documents...</span>
                    </div>
                  ) : documents.filter(d => d.documentType !== 'test_report' && d.documentType !== 'prescription').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No other documents found</p>
                      <Button className="mt-4" data-testid="button-upload-other">
                        Upload Document
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {documents
                        .filter(d => d.documentType !== 'test_report' && d.documentType !== 'prescription')
                        .map((document) => (
                          <div key={document.id} className="flex items-center gap-4 p-6 border rounded-lg">
                            <div className="p-3 bg-purple-100 rounded-lg">
                              <FileText className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{document.fileName}</h4>
                              <p className="text-muted-foreground">{document.issuingProvider}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span>{new Date(document.documentDate).toLocaleDateString()}</span>
                                <Badge variant="outline">{document.documentType.replace('_', ' ')}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" data-testid={`button-view-document-${document.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" data-testid={`button-download-document-${document.id}`}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              {/* Health Summary Section */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Health Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Allergies */}
                    <div>
                      <h3 className="font-semibold mb-2">Allergies</h3>
                      {displayPatient.allergies && displayPatient.allergies.length > 0 ? (
                        <ul className="space-y-1">
                          {displayPatient.allergies.map((allergy, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <span>{allergy}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No known allergies</p>
                      )}
                    </div>
                    
                    {/* Chronic Conditions */}
                    <div>
                      <h3 className="font-semibold mb-2">Chronic Conditions</h3>
                      {displayPatient.chronicConditions && displayPatient.chronicConditions.length > 0 ? (
                        <ul className="space-y-1">
                          {displayPatient.chronicConditions.map((condition, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-orange-500" />
                              <span>{condition}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No chronic conditions</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Medical History</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" data-testid="button-upload-new-document">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </div>
              
              {/* Tabs for different document types */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Records</TabsTrigger>
                  <TabsTrigger value="reports">Test Reports</TabsTrigger>
                  <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                  <TabsTrigger value="other">Other Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  {documentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading medical records...</span>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No medical records found</p>
                      <Button className="mt-4" data-testid="button-upload-first-document">
                        Upload Your First Document
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {documents.map((document) => (
                        <div key={document.id} className="flex items-center gap-4 p-6 border rounded-lg">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <FileText className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{document.fileName}</h4>
                            <p className="text-muted-foreground">{document.issuingProvider}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span>{new Date(document.documentDate).toLocaleDateString()}</span>
                              <Badge variant="outline">{document.documentType.replace('_', ' ')}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" data-testid={`button-view-document-${document.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" data-testid={`button-download-document-${document.id}`}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="health">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Vitals</CardTitle>
                  <Button variant="outline" size="sm" data-testid="button-add-vitals">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reading
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockHealthMetrics.map((metric) => {
                      // Map trend to a status for the badge
                      const status = metric.trend === 'stable' || metric.trend === 'improving' ? 'default' : 'destructive';
                      
                      return (
                        <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{metric.name}</h4>
                            <p className="text-2xl font-bold text-primary">
                              {metric.value} <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">Trend: {metric.trend}</p>
                          </div>
                          <Badge variant={status}>
                            {metric.trend}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Health Analytics</h3>
                    <p className="text-muted-foreground">
                      Track your health metrics over time to identify trends and improvements.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Full Name</label>
                      <p className="font-semibold">{displayPatient.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Date of Birth</label>
                      <p className="font-semibold">{new Date(displayPatient.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Gender</label>
                      <p className="font-semibold">{displayPatient.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Phone</label>
                      <p className="font-semibold">{displayPatient.phoneNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Location</label>
                      <p className="font-semibold">{displayPatient.city}, {displayPatient.state}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Blood Group</label>
                      <p className="font-semibold">{displayPatient.bloodGroup}</p>
                    </div>
                  </div>
                  <Button className="w-full" data-testid="button-edit-profile">
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Allergies</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {displayPatient.allergies?.map((allergy, index) => (
                        <Badge key={index} variant="destructive">{allergy}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground">Chronic Conditions</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {displayPatient.chronicConditions?.map((condition, index) => (
                        <Badge key={index} variant="outline">{condition}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Budget Preference</label>
                    <p className="font-semibold capitalize">{displayPatient.preferredBudgetRange}</p>
                  </div>

                  <Button variant="outline" className="w-full" data-testid="button-edit-medical-info">
                    <FileText className="h-4 w-4 mr-2" />
                    Update Medical Info
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}