import { useState } from "react";
import { Button } from "@/components/ui/button";
import BookingModal from '../BookingModal';
import doctorPhoto from "@assets/generated_images/Doctor_profile_photo_63744992.png";

const sampleDoctor = {
  id: "1",
  name: "Priya Sharma",
  specialty: "Cardiologist",
  consultationFee: 800,
  photo: doctorPhoto
};

export default function BookingModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-booking">
        Open Booking Modal
      </Button>
      
      <BookingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        doctor={sampleDoctor}
        onConfirmBooking={(bookingData) => console.log('Booking confirmed:', bookingData)}
      />
    </div>
  );
}