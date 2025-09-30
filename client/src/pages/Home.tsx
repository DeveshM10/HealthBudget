import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BudgetTierCard from "@/components/BudgetTierCard";
import DoctorCard from "@/components/DoctorCard";
import SearchInterface from "@/components/SearchInterface";
import BookingModal from "@/components/BookingModal";
import TrustSection from "@/components/TrustSection";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Stethoscope, Building2, Loader } from "lucide-react";
import doctorPhoto from "@assets/generated_images/Doctor_profile_photo_63744992.png";
import type { Doctor } from "@shared/schema";

// Mock data - todo: remove mock functionality
const budgetTiers = [
  {
    id: "basic",
    title: "Basic Care",
    price: "₹10k",
    description: "Essential healthcare for routine needs",
    features: [
      "General physician consultation",
      "Basic diagnostic tests",
      "Generic medication delivery",
      "Health record maintenance",
      "24/7 chat support"
    ],
    icon: <Heart className="h-6 w-6" />
  },
  {
    id: "specialist",
    title: "Specialist Care",
    price: "₹1L",
    description: "Advanced care with specialist doctors",
    features: [
      "Specialist consultations",
      "Advanced diagnostic tests",
      "2 follow-up consultations",
      "Treatment plan creation",
      "Priority booking",
      "Insurance claim support"
    ],
    popular: true,
    icon: <Stethoscope className="h-6 w-6" />
  },
  {
    id: "premium",
    title: "Premium Care",
    price: "₹10L",
    description: "Comprehensive care including surgeries",
    features: [
      "Complete surgical packages",
      "Hospital partner network",
      "EMI assistance available",
      "Post-surgery care",
      "Dedicated care coordinator",
      "Insurance pre-authorization",
      "Second opinion included"
    ],
    icon: <Building2 className="h-6 w-6" />
  }
];

const sampleDoctors = [
  {
    id: "1",
    name: "Priya Sharma",
    specialty: "Cardiologist",
    experience: 12,
    rating: 4.8,
    reviewCount: 234,
    consultationFee: 800,
    location: "Mumbai",
    nextAvailable: "Today 3:00 PM",
    verified: true,
    photo: doctorPhoto,
    languages: ["Hindi", "English", "Marathi"],
    availableToday: true
  },
  {
    id: "2",
    name: "Rahul Kumar",
    specialty: "General Physician",
    experience: 8,
    rating: 4.6,
    reviewCount: 156,
    consultationFee: 500,
    location: "Delhi",
    nextAvailable: "Tomorrow 10:00 AM",
    verified: true,
    languages: ["Hindi", "English"],
    availableToday: false
  },
  {
    id: "3",
    name: "Anjali Patel",
    specialty: "Dermatologist",
    experience: 15,
    rating: 4.9,
    reviewCount: 312,
    consultationFee: 1200,
    location: "Bangalore",
    nextAvailable: "Today 6:00 PM",
    verified: true,
    languages: ["English", "Gujarati", "Hindi"],
    availableToday: true
  }
];

// Define the interface for transformed doctor data used by DoctorCard
interface TransformedDoctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  location: string;
  nextAvailable: string;
  verified: boolean;
  photo: string;
  languages: string[];
  availableToday: boolean;
}

export default function Home() {
  const [selectedDoctor, setSelectedDoctor] = useState<TransformedDoctor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [location, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState<{
    query?: string;
    specialty?: string;
    city?: string;
    minRating?: number;
    maxFee?: number;
  }>({});

  // Fetch doctors from API
  const { data: doctors = [], isLoading, error } = useQuery({
    queryKey: ['/api/doctors/search', searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchParams.query) params.append('query', searchParams.query);
      if (searchParams.specialty) params.append('specialty', searchParams.specialty);
      if (searchParams.city) params.append('city', searchParams.city);
      if (searchParams.minRating) params.append('minRating', searchParams.minRating.toString());
      if (searchParams.maxFee) params.append('maxFee', searchParams.maxFee.toString());
      
      const response = await fetch(`/api/doctors/search?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      return response.json() as Promise<Doctor[]>;
    },
    enabled: showDoctors
  });

  const handleBookConsultation = (doctor: TransformedDoctor) => {
    setSelectedDoctor(doctor);
    setIsBookingModalOpen(true);
  };

  const handleViewProfile = (doctor: TransformedDoctor) => {
    setLocation(`/doctor/${doctor.id}`);
  };

  const handleProfileClick = () => {
    setLocation('/dashboard');
  };

  const handleSearch = (query: string, filters?: any) => {
    setShowDoctors(true);
    setSearchParams({
      query: query || undefined,
      specialty: filters?.specialty || undefined,
      city: filters?.location || undefined,
      minRating: filters?.rating ? parseFloat(filters.rating) : undefined,
      maxFee: filters?.budgetRange ? parseFloat(filters.budgetRange) : undefined
    });
    console.log('Search executed:', { query, filters });
  };

  const handleBudgetTierSelect = (tier: any) => {
    setShowDoctors(true);
    // Map budget tier to max fee
    const feeMapping: { [key: string]: number } = {
      'basic': 500,
      'specialist': 1000,
      'premium': 2000
    };
    setSearchParams({
      maxFee: feeMapping[tier.id] || undefined
    });
    console.log('Budget tier selected:', tier.title);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onSearch={handleSearch}
        onProfileClick={handleProfileClick}
        onMenuClick={() => console.log('Menu clicked')}
      />

      {/* Hero Section */}
      <HeroSection 
        onSearch={handleSearch}
        onGetStarted={() => setShowDoctors(true)}
      />

      {/* Budget Tiers Section */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Healthcare Budget</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transparent pricing for every healthcare need. No hidden costs, no surprises.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {budgetTiers.map((tier) => (
              <BudgetTierCard
                key={tier.id}
                tier={tier}
                onSelect={handleBudgetTierSelect}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Search Interface */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Find the Right Doctor</h2>
              <p className="text-muted-foreground">
                Search by specialty, budget, location, and availability
              </p>
            </div>
            <SearchInterface onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      {showDoctors && (
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Available Doctors</h2>
                <p className="text-muted-foreground">
                  {isLoading ? 'Searching...' : 
                   error ? 'Error loading doctors' : 
                   `${doctors.length} doctors found matching your criteria`}
                </p>
              </div>
              <ThemeToggle />
            </div>
            
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading doctors...</span>
              </div>
            )}
            
            {error && (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">Failed to load doctors. Please try again.</p>
                <Button onClick={() => setShowDoctors(false)}>Go Back</Button>
              </div>
            )}
            
            {!isLoading && !error && doctors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No doctors found matching your criteria.</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search filters.</p>
              </div>
            )}
            
            {!isLoading && !error && doctors.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => {
                  // Transform doctor data to match DoctorCard expectations
                  const transformedDoctor = {
                    id: doctor.id,
                    name: doctor.fullName,
                    specialty: doctor.primarySpecialty,
                    experience: doctor.yearsOfExperience,
                    rating: parseFloat(doctor.rating || '0'),
                    reviewCount: doctor.totalReviews || 0,
                    consultationFee: parseFloat(doctor.consultationFee),
                    location: `${doctor.city}, ${doctor.state}`,
                    nextAvailable: "Available today", // TODO: Implement availability
                    verified: doctor.verificationStatus === 'verified',
                    photo: doctor.profilePhoto || doctorPhoto,
                    languages: doctor.languages || ['English'],
                    availableToday: doctor.isActive || false
                  };
                  
                  return (
                    <DoctorCard
                      key={doctor.id}
                      doctor={transformedDoctor}
                      onBookConsultation={() => handleBookConsultation(transformedDoctor)}
                      onViewProfile={() => handleViewProfile(transformedDoctor)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trust Section */}
      <TrustSection />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join thousands of satisfied patients who found quality healthcare within their budget
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => setShowDoctors(true)}
            data-testid="button-cta-start"
          >
            Find Your Doctor Now
          </Button>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        doctor={selectedDoctor}
        onConfirmBooking={(bookingData) => {
          console.log('Booking confirmed:', bookingData);
          alert('Booking confirmed! You will receive a confirmation email shortly.');
        }}
      />
    </div>
  );
}