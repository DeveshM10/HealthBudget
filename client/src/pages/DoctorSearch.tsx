import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IndianRupee, MapPin, Star, Calendar, Video } from "lucide-react";

// Mock data for doctors
const mockDoctors = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    specialty: "General Physician",
    location: "Mumbai",
    fee: 800,
    rating: 4.8,
    experience: 12,
    verified: true,
    image: "/doctors/doctor1.jpg",
    nextAvailable: "Today",
    budget: "10k"
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiologist",
    location: "Delhi",
    fee: 1500,
    rating: 4.9,
    experience: 15,
    verified: true,
    image: "/doctors/doctor2.jpg",
    nextAvailable: "Tomorrow",
    budget: "1L"
  },
  {
    id: "3",
    name: "Dr. Ananya Patel",
    specialty: "Pediatrician",
    location: "Bangalore",
    fee: 1000,
    rating: 4.7,
    experience: 8,
    verified: true,
    image: "/doctors/doctor3.jpg",
    nextAvailable: "Today",
    budget: "10k"
  },
  {
    id: "4",
    name: "Dr. Vikram Singh",
    specialty: "Orthopedic Surgeon",
    location: "Chennai",
    fee: 2500,
    rating: 4.9,
    experience: 20,
    verified: true,
    image: "/doctors/doctor4.jpg",
    nextAvailable: "In 2 days",
    budget: "10L"
  },
  {
    id: "5",
    name: "Dr. Meera Reddy",
    specialty: "Dermatologist",
    location: "Hyderabad",
    fee: 1200,
    rating: 4.6,
    experience: 10,
    verified: true,
    image: "/doctors/doctor5.jpg",
    nextAvailable: "Tomorrow",
    budget: "1L"
  }
];

// Specialty options
const specialties = [
  "All Specialties",
  "General Physician",
  "Cardiologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Dermatologist",
  "Neurologist",
  "Gynecologist",
  "ENT Specialist",
  "Psychiatrist",
  "Ophthalmologist"
];

// Location options
const locations = [
  "All Locations",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow"
];

// Budget options
const budgetOptions = [
  { value: "all", label: "All Budgets" },
  { value: "10k", label: "Basic Care (₹10,000)" },
  { value: "1L", label: "Specialist Care (₹1,00,000)" },
  { value: "10L", label: "Surgical Care (₹10,00,000)" }
];

export default function DoctorSearch() {
  // Filter states
  const [specialty, setSpecialty] = useState("All Specialties");
  const [location, setLocation] = useState("All Locations");
  const [budget, setBudget] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter doctors based on selected filters
  const filteredDoctors = mockDoctors.filter((doctor) => {
    // Filter by specialty
    if (specialty !== "All Specialties" && doctor.specialty !== specialty) {
      return false;
    }
    
    // Filter by location
    if (location !== "All Locations" && doctor.location !== location) {
      return false;
    }
    
    // Filter by budget
    if (budget !== "all" && doctor.budget !== budget) {
      return false;
    }
    
    // Filter by price range
    if (doctor.fee < priceRange[0] || doctor.fee > priceRange[1]) {
      return false;
    }
    
    // Filter by search term
    if (
      searchTerm &&
      !doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Find the Right Doctor</h1>
      
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Search Bar */}
        <div className="col-span-1 md:col-span-4">
          <Input
            placeholder="Search by doctor name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Specialty Filter */}
        <div>
          <Label htmlFor="specialty">Specialty</Label>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger id="specialty">
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Location Filter */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Budget Filter */}
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger id="budget">
              <SelectValue placeholder="Select budget" />
            </SelectTrigger>
            <SelectContent>
              {budgetOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Price Range Filter */}
        <div>
          <Label>Consultation Fee Range (₹{priceRange[0]} - ₹{priceRange[1]})</Label>
          <Slider
            defaultValue={[0, 5000]}
            max={5000}
            step={100}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mt-6"
          />
        </div>
      </div>
      
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Found {filteredDoctors.length} doctors matching your criteria
        </p>
      </div>
      
      {/* Doctor Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={doctor.image} alt={doctor.name} />
                    <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                      <span className="text-xs text-muted-foreground ml-2">({doctor.experience} yrs exp)</span>
                    </div>
                  </div>
                </div>
                {doctor.verified && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Verified
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>₹{doctor.fee} fee</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{doctor.nextAvailable}</span>
                </div>
                <div className="flex items-center">
                  <Video className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>Video consult</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" className="w-[48%]">View Profile</Button>
              <Button className="w-[48%]">Book Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* No Results */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No doctors found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more results
          </p>
        </div>
      )}
    </div>
  );
}