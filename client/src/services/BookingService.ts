// BookingService.ts - Handles booking data management

export interface Booking {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  consultationType: 'video' | 'audio';
  symptoms: string;
  paymentId: string;
  paymentAmount: number;
  createdAt: string;
}

// Mock data for bookings
const MOCK_BOOKINGS: Booking[] = [];

// Generate a unique ID for new bookings
const generateBookingId = (): string => {
  return `booking_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Create a new booking
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
  // In production, this would be an API call to your backend
  console.log('Creating booking:', bookingData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create new booking with generated ID
  const newBooking: Booking = {
    ...bookingData,
    id: generateBookingId(),
    createdAt: new Date().toISOString(),
  };
  
  // Add to mock data
  MOCK_BOOKINGS.push(newBooking);
  
  return newBooking;
};

// Get bookings for a patient
export const getPatientBookings = async (patientId: string): Promise<Booking[]> => {
  // In production, this would be an API call to your backend
  console.log('Getting bookings for patient:', patientId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter bookings by patient ID
  return MOCK_BOOKINGS.filter(booking => booking.patientId === patientId);
};

// Get bookings for a doctor
export const getDoctorBookings = async (doctorId: string): Promise<Booking[]> => {
  // In production, this would be an API call to your backend
  console.log('Getting bookings for doctor:', doctorId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter bookings by doctor ID
  return MOCK_BOOKINGS.filter(booking => booking.doctorId === doctorId);
};

// Cancel a booking
export const cancelBooking = async (bookingId: string): Promise<boolean> => {
  // In production, this would be an API call to your backend
  console.log('Cancelling booking:', bookingId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find booking and update status
  const bookingIndex = MOCK_BOOKINGS.findIndex(booking => booking.id === bookingId);
  if (bookingIndex !== -1) {
    MOCK_BOOKINGS[bookingIndex].status = 'cancelled';
    return true;
  }
  
  return false;
};