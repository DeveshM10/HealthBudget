import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Shield, Video, Calendar } from "lucide-react";

interface Doctor {
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
  photo?: string;
  languages: string[];
  availableToday: boolean;
}

interface DoctorCardProps {
  doctor: Doctor;
  onBookConsultation?: (doctor: Doctor) => void;
  onViewProfile?: (doctor: Doctor) => void;
}

export default function DoctorCard({ doctor, onBookConsultation, onViewProfile }: DoctorCardProps) {
  const handleBookConsultation = () => {
    onBookConsultation?.(doctor);
    console.log('Book consultation with:', doctor.name);
  };

  const handleViewProfile = () => {
    onViewProfile?.(doctor);
    console.log('View profile of:', doctor.name);
  };

  return (
    <Card className="hover-elevate transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={doctor.photo} alt={doctor.name} />
            <AvatarFallback className="text-lg font-semibold">
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  Dr. {doctor.name}
                  {doctor.verified && (
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </h3>
                <p className="text-muted-foreground">{doctor.specialty}</p>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-primary">₹{doctor.consultationFee}</div>
                <div className="text-xs text-muted-foreground">per consultation</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{doctor.rating}</span>
                <span>({doctor.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{doctor.location}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {doctor.experience} years exp.
          </Badge>
          {doctor.languages.map((lang) => (
            <Badge key={lang} variant="outline" className="text-xs">
              {lang}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Next available: {doctor.nextAvailable}</span>
          </div>
          {doctor.availableToday && (
            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
              Available Today
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewProfile}
            className="flex-1"
            data-testid={`button-view-profile-${doctor.id}`}
          >
            View Profile
          </Button>
          <Button 
            onClick={handleBookConsultation}
            size="sm"
            className="flex-1 group"
            data-testid={`button-book-${doctor.id}`}
          >
            <Video className="h-4 w-4 mr-2" />
            Book Now
            <Calendar className="h-4 w-4 ml-2 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}