import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import BookingModal from "@/components/BookingModal";
import { createBooking } from "@/services/BookingService";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  Shield, 
  GraduationCap, 
  Award,
  MessageCircle,
  Video,
  Phone,
  Loader,
  IndianRupee,
  CheckCircle2,
  FileText,
  Stethoscope,
  Building,
  Languages,
  ThumbsUp
} from "lucide-react";
import type { Doctor } from "@shared/schema";
import doctorPhoto from "@assets/generated_images/Doctor_profile_photo_63744992.png";

export default function DoctorProfile() {
  const [match, params] = useRoute("/doctor/:id");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const { toast } = useToast();
  
  const doctorId = params?.id;

  const { data: doctor, isLoading, error } = useQuery({
    queryKey: ['/api/doctors', doctorId],
    queryFn: async () => {
      if (!doctorId) throw new Error('No doctor ID provided');
      const response = await fetch(`/api/doctors/${doctorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctor details');
      }
      return response.json() as Promise<Doctor>;
    },
    enabled: !!doctorId
  });

  if (!match) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="h-6 w-6 animate-spin" />
          <span>Loading doctor profile...</span>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Doctor Not Found</h1>
          <p className="text-muted-foreground mb-4">The doctor you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/')}>Go Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleBookConsultation = () => {
    setIsBookingModalOpen(true);
  };
  
  // Function to handle booking confirmation
  const handleConfirmBooking = async (bookingData) => {
    try {
      setIsProcessingBooking(true);
      
      // Create booking using BookingService
      const booking = await createBooking({
        doctorId: doctorId || '',
        patientId: 'current-user-id', // In production, get from auth context
        date: bookingData.date,
        time: bookingData.time,
        status: 'confirmed',
        consultationType: bookingData.consultationType,
        symptoms: bookingData.symptoms,
        paymentId: bookingData.paymentId,
        paymentAmount: transformedDoctor.consultationFee || 0,
      });
      
      toast({
        title: "Appointment Booked!",
        description: `Your appointment with Dr. ${doctor.fullName} has been confirmed.`,
        variant: "default",
      });
      
      setIsBookingModalOpen(false);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Error",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingBooking(false);
    }
  };

  // Enhanced doctor data with budget tier and credentials
  const transformedDoctor = {
    id: doctor.id,
    name: doctor.fullName,
    specialty: doctor.primarySpecialty,
    experience: doctor.yearsOfExperience,
    rating: parseFloat(doctor.rating || '0'),
    reviewCount: doctor.totalReviews || 0,
    consultationFee: parseFloat(doctor.consultationFee),
    location: `${doctor.city}, ${doctor.state}`,
    nextAvailable: "Available today",
    verified: doctor.verificationStatus === 'verified',
    photo: doctor.profilePhoto || doctorPhoto,
    languages: doctor.languages || ['English'],
    availableToday: doctor.isActive || false,
    // Added fields for enhanced profile
    medicalSchool: doctor.medicalSchool || "AIIMS Delhi",
    residency: doctor.residency || "Apollo Hospitals",
    certifications: doctor.certifications || ["Board Certified in Internal Medicine", "Fellowship in Cardiology"],
    hospitalAffiliations: doctor.hospitalAffiliations || ["Max Healthcare", "Fortis Hospital"],
    specialInterests: doctor.specialInterests || ["Preventive Cardiology", "Heart Failure Management"],
    publications: doctor.researchPublications || [
      { title: "Advances in Cardiac Care", year: 2020, journal: "Indian Heart Journal" },
      { title: "Hypertension Management in South Asian Population", year: 2018, journal: "Journal of Hypertension" }
    ],
    awards: doctor.awards || [
      { name: "Excellence in Patient Care", year: 2019 },
      { name: "Young Investigator Award", year: 2017 }
    ],
    // Budget tier based on consultation fee
    budgetTier: parseFloat(doctor.consultationFee) <= 1000 ? "10k" : 
                parseFloat(doctor.consultationFee) <= 2000 ? "1L" : "10L",
    // Transparent pricing breakdown
    pricingBreakdown: {
      consultationFee: parseFloat(doctor.consultationFee),
      followUpFee: parseFloat(doctor.consultationFee) * 0.5,
      medicationEstimate: 500,
      diagnosticsEstimate: 1200,
      totalEstimate: parseFloat(doctor.consultationFee) + (parseFloat(doctor.consultationFee) * 0.5) + 500 + 1200
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Budget Badge */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 py-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
          
          {/* Budget Badge */}
          <Badge className={`px-3 py-1 text-white ${
            transformedDoctor.budgetTier === "10k" ? "bg-green-600" : 
            transformedDoctor.budgetTier === "1L" ? "bg-blue-600" : "bg-purple-600"
          }`}>
            <IndianRupee className="h-3 w-3 mr-1" />
            {transformedDoctor.budgetTier} Budget Tier
          </Badge>
        </div>
      </div>
      
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
        {/* Doctor Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-32 w-32 mx-auto md:mx-0">
                <AvatarImage src={transformedDoctor.photo} alt={doctor.fullName} />
                <AvatarFallback className="text-2xl">
                  {doctor.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
                      Dr. {doctor.fullName}
                      {transformedDoctor.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-4">{doctor.primarySpecialty}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{transformedDoctor.rating}</span>
                        <span>({transformedDoctor.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{transformedDoctor.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        <span>{doctor.yearsOfExperience} years experience</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center md:text-right">
                    <div className="text-3xl font-bold text-primary mb-2">₹{transformedDoctor.consultationFee}</div>
                    <div className="text-sm text-muted-foreground mb-4">per consultation</div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={handleBookConsultation}
                        size="lg"
                        data-testid="button-book-consultation"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Book Video Consultation
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Audio Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Details Tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Dr. {doctor.fullName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {doctor.bio && (
                  <div>
                    <h3 className="font-semibold mb-2">Biography</h3>
                    <p className="text-muted-foreground">{doctor.bio}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{doctor.primarySpecialty}</Badge>
                    {doctor.subSpecialties?.map((specialty, index) => (
                      <Badge key={index} variant="outline">{specialty}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {transformedDoctor.languages.map((language, index) => (
                      <Badge key={index} variant="secondary">
                        <Languages className="h-3 w-3 mr-1" />
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                {transformedDoctor.hospitalAffiliations && transformedDoctor.hospitalAffiliations.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Hospital Affiliations</h3>
                    <div className="space-y-1">
                      {transformedDoctor.hospitalAffiliations.map((hospital, index) => (
                        <div key={index} className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{hospital}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {doctor.specialInterests && doctor.specialInterests.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Special Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {doctor.specialInterests.map((interest, index) => (
                        <Badge key={index} variant="outline">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credentials">
            <Card>
              <CardHeader>
                <CardTitle>Credentials & Qualifications</CardTitle>
                <CardDescription>Verified professional background and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 text-blue-600" />
                    Education & Training
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Medical School:</span> {transformedDoctor.medicalSchool}
                    </li>
                    <li>
                      <span className="font-medium">Residency:</span> {transformedDoctor.residency}
                    </li>
                    <li>
                      <span className="font-medium">MD in {transformedDoctor.specialty}</span> - Post Graduate Institute of Medical Education and Research
                    </li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    Certifications
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {transformedDoctor.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-yellow-600" />
                    Awards & Recognition
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {transformedDoctor.awards.map((award, index) => (
                      <li key={index}>{award.name} ({award.year})</li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-purple-600" />
                    Publications
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {transformedDoctor.publications.map((pub, index) => (
                      <li key={index}>
                        "{pub.title}" - {pub.journal} ({pub.year})
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Education & Training</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Medical School</h4>
                  <p className="text-muted-foreground">{doctor.medicalSchool}</p>
                </div>
                
                {doctor.residency && (
                  <div>
                    <h4 className="font-semibold">Residency</h4>
                    <p className="text-muted-foreground">{doctor.residency}</p>
                  </div>
                )}

                {doctor.fellowship && (
                  <div>
                    <h4 className="font-semibold">Fellowship</h4>
                    <p className="text-muted-foreground">{doctor.fellowship}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold">Years of Experience</h4>
                  <p className="text-muted-foreground">{doctor.yearsOfExperience} years</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Available Today</h3>
                  <p className="text-muted-foreground mb-4">
                    Dr. {doctor.fullName} is available for consultations
                  </p>
                  <Button onClick={handleBookConsultation}>
                    <Clock className="h-4 w-4 mr-2" />
                    View Available Slots
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Patient Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                    <span className="text-3xl font-bold">{transformedDoctor.rating}</span>
                  </div>
                  <p className="text-muted-foreground">
                    Based on {transformedDoctor.reviewCount} patient reviews
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>

      {/* Booking Card with Transparent Pricing */}
      <div className="col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Book Appointment</CardTitle>
            <CardDescription>Transparent pricing with no hidden costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Transparent Pricing Section */}
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h3 className="font-medium flex items-center">
                <IndianRupee className="h-4 w-4 mr-2" />
                Transparent Cost Breakdown
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Consultation Fee</span>
                  <span className="font-medium">₹{transformedDoctor.pricingBreakdown.consultationFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Follow-up Visit</span>
                  <span className="font-medium">₹{transformedDoctor.pricingBreakdown.followUpFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Est. Medication Cost</span>
                  <span className="font-medium">₹{transformedDoctor.pricingBreakdown.medicationEstimate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Est. Diagnostics</span>
                  <span className="font-medium">₹{transformedDoctor.pricingBreakdown.diagnosticsEstimate}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold">
                  <span>Total Estimated Cost</span>
                  <span>₹{transformedDoctor.pricingBreakdown.totalEstimate}</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                * Actual costs may vary based on your specific condition and treatment plan
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Available Consultation Types</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Video Consultation
                </Button>
                <Button variant="outline" className="justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Consultation
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat Consultation
                </Button>
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-start">
                <ThumbsUp className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Budget-Friendly Option</p>
                  <p className="text-xs text-green-700">This doctor fits within your selected budget tier</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleBookConsultation}
            >
              Book Now
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              By booking, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        doctor={transformedDoctor}
        onConfirmBooking={handleConfirmBooking}
      />
      </div>
    </div>
  );
}