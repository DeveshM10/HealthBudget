import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Video, CreditCard, Shield, X, CheckCircle2, AlertCircle } from "lucide-react";
import { initiatePayment, verifyPayment } from "@/services/PaymentService";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  consultationFee: number;
  photo?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onConfirmBooking?: (bookingData: any) => void;
}

export default function BookingModal({ isOpen, onClose, doctor, onConfirmBooking }: BookingModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    symptoms: "",
    patientName: "",
    patientAge: "",
    patientPhone: "",
    patientEmail: "",
    consultationType: "video",
    paymentId: "",
    orderId: "",
    signature: ""
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
      console.log('Moved to step:', step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      console.log('Moved to step:', step - 1);
    }
  };

  const calculateTotalAmount = () => {
    if (!doctor) return 0;
    const consultationFee = doctor.consultationFee;
    const platformFee = 50;
    const gst = Math.round((consultationFee + platformFee) * 0.18);
    return Math.round((consultationFee + platformFee + gst));
  };

  const handleConfirmBooking = async () => {
    if (!doctor) return;
    
    try {
      setIsProcessing(true);
      setPaymentStatus("processing");
      
      // Initiate payment with Razorpay
      const paymentResponse = await initiatePayment({
        amount: calculateTotalAmount(),
        name: "HealthBudget",
        description: `Consultation with Dr. ${doctor.name}`,
        prefillData: {
          name: bookingData.patientName,
          email: bookingData.patientEmail,
          contact: bookingData.patientPhone
        }
      });
      
      // Verify payment with backend
      const isVerified = await verifyPayment(paymentResponse);
      
      if (isVerified) {
        // Update booking data with payment details
        const updatedBookingData = {
          ...bookingData,
          paymentId: paymentResponse.razorpay_payment_id,
          orderId: paymentResponse.razorpay_order_id,
          signature: paymentResponse.razorpay_signature
        };
        
        setBookingData(updatedBookingData);
        setPaymentStatus("success");
        
        // Call the onConfirmBooking callback with updated data
        onConfirmBooking?.(updatedBookingData);
        
        toast({
          title: "Booking Confirmed!",
          description: "Your appointment has been successfully booked.",
          variant: "default",
        });
        
        // Close modal and reset state
        setTimeout(() => {
          onClose();
          setStep(1);
          setPaymentStatus("idle");
        }, 2000);
      } else {
        setPaymentStatus("error");
        toast({
          title: "Payment Failed",
          description: "There was an issue with your payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "There was an issue with your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const updateBookingData = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={doctor.photo} alt={doctor.name} />
              <AvatarFallback>
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div>Book Consultation</div>
              <div className="text-sm font-normal text-muted-foreground">
                Dr. {doctor.name} - {doctor.specialty}
              </div>
            </div>
          </DialogTitle>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && <div className="w-8 h-0.5 bg-muted mx-1" />}
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => updateBookingData('date', e.target.value)}
                  data-testid="input-booking-date"
                />
              </div>
              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Select value={bookingData.time} onValueChange={(value) => updateBookingData('time', value)}>
                  <SelectTrigger data-testid="select-booking-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">02:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                    <SelectItem value="16:00">04:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="consultation-type">Consultation Type</Label>
              <Select value={bookingData.consultationType} onValueChange={(value) => updateBookingData('consultationType', value)}>
                <SelectTrigger data-testid="select-consultation-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video Call
                    </div>
                  </SelectItem>
                  <SelectItem value="audio">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Audio Call
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="symptoms">Symptoms or Reason for Visit</Label>
              <Textarea
                id="symptoms"
                placeholder="Briefly describe your symptoms or reason for consultation..."
                value={bookingData.symptoms}
                onChange={(e) => updateBookingData('symptoms', e.target.value)}
                data-testid="textarea-symptoms"
              />
            </div>
          </div>
        )}

        {/* Step 2: Patient Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input
                  id="patient-name"
                  value={bookingData.patientName}
                  onChange={(e) => updateBookingData('patientName', e.target.value)}
                  placeholder="Full name"
                  data-testid="input-patient-name"
                />
              </div>
              <div>
                <Label htmlFor="patient-age">Age</Label>
                <Input
                  id="patient-age"
                  type="number"
                  value={bookingData.patientAge}
                  onChange={(e) => updateBookingData('patientAge', e.target.value)}
                  placeholder="Age"
                  data-testid="input-patient-age"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="patient-phone">Phone Number</Label>
              <Input
                id="patient-phone"
                type="tel"
                value={bookingData.patientPhone}
                onChange={(e) => updateBookingData('patientPhone', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                data-testid="input-patient-phone"
              />
            </div>

            <div>
              <Label htmlFor="patient-email">Email Address</Label>
              <Input
                id="patient-email"
                type="email"
                value={bookingData.patientEmail}
                onChange={(e) => updateBookingData('patientEmail', e.target.value)}
                placeholder="your.email@example.com"
                data-testid="input-patient-email"
              />
            </div>
          </div>
        )}

        {/* Step 3: Payment Summary */}
        {step === 3 && (
          <div className="space-y-4">
            {paymentStatus === "success" ? (
              <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-600" />
                <h3 className="font-medium text-lg text-green-800">Payment Successful!</h3>
                <p className="text-sm text-green-700">
                  Your appointment with Dr. {doctor.name} has been confirmed for {bookingData.date} at {bookingData.time}.
                </p>
                <div className="text-xs text-green-600">
                  A confirmation email has been sent to {bookingData.patientEmail}
                </div>
              </div>
            ) : paymentStatus === "error" ? (
              <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center space-y-3">
                <AlertCircle className="h-12 w-12 mx-auto text-red-600" />
                <h3 className="font-medium text-lg text-red-800">Payment Failed</h3>
                <p className="text-sm text-red-700">
                  There was an issue processing your payment. Please try again.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <h3 className="font-medium">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Consultation Fee</span>
                      <span>₹{doctor.consultationFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee</span>
                      <span>₹50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%)</span>
                      <span>₹{Math.round((doctor.consultationFee + 50) * 0.18)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-medium">
                      <span>Total Amount</span>
                      <span>₹{calculateTotalAmount()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Your payment is secure and encrypted</span>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="text-sm font-medium text-green-800">
                    100% Refund Policy
                  </div>
                  <div className="text-xs text-green-600">
                    Full refund if cancelled 2+ hours before appointment
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <DialogFooter className="flex gap-2">
          {paymentStatus === "success" ? (
            <Button onClick={onClose} className="w-full" data-testid="button-done">
              Done
            </Button>
          ) : paymentStatus === "error" ? (
            <>
              <Button variant="outline" onClick={onClose} data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={() => setPaymentStatus("idle")} data-testid="button-try-again">
                Try Again
              </Button>
            </>
          ) : (
            <>
              {step > 1 && paymentStatus === "idle" && (
                <Button variant="outline" onClick={handleBack} data-testid="button-back">
                  Back
                </Button>
              )}
              <Button variant="outline" onClick={onClose} data-testid="button-cancel">
                Cancel
              </Button>
              {step < 3 ? (
                <Button onClick={handleNext} data-testid="button-next">
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleConfirmBooking} 
                  disabled={isProcessing}
                  data-testid="button-confirm-booking"
                >
                  {isProcessing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay & Book
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
