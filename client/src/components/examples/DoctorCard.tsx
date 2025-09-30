import DoctorCard from '../DoctorCard';
import doctorPhoto from "@assets/generated_images/Doctor_profile_photo_63744992.png";

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

export default function DoctorCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {sampleDoctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          onBookConsultation={(doc) => console.log('Book consultation with:', doc.name)}
          onViewProfile={(doc) => console.log('View profile of:', doc.name)}
        />
      ))}
    </div>
  );
}