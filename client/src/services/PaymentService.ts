// PaymentService.ts - Handles payment integration with Razorpay
import { loadScript } from '@/lib/utils';

export interface PaymentOptions {
  amount: number;
  currency?: string;
  name: string;
  description: string;
  orderId?: string;
  prefillData?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Mock function to simulate order creation from backend
const createOrder = async (amount: number): Promise<string> => {
  // In production, this would be an API call to your backend
  // which would create an order with Razorpay and return the order ID
  console.log(`Creating order for amount: ${amount}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a mock order ID
  return `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

export const initiatePayment = async (options: PaymentOptions): Promise<PaymentResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Load Razorpay script if not already loaded
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      
      if (!res) {
        reject(new Error('Razorpay SDK failed to load'));
        return;
      }
      
      // Create order ID if not provided
      const orderId = options.orderId || await createOrder(options.amount);
      
      // Configure Razorpay options
      const razorpayOptions = {
        key: 'rzp_test_YourTestKey', // Replace with your actual test key
        amount: options.amount * 100, // Razorpay expects amount in paise
        currency: options.currency || 'INR',
        name: options.name,
        description: options.description,
        order_id: orderId,
        handler: function(response: PaymentResponse) {
          resolve(response);
        },
        prefill: options.prefillData || {},
        theme: options.theme || { color: '#3B82F6' },
        modal: {
          ondismiss: function() {
            reject(new Error('Payment cancelled by user'));
          }
        }
      };
      
      // Initialize Razorpay
      const paymentObject = new (window as any).Razorpay(razorpayOptions);
      paymentObject.open();
      
    } catch (error) {
      reject(error);
    }
  });
};

export const verifyPayment = async (paymentResponse: PaymentResponse): Promise<boolean> => {
  // In production, this would be an API call to your backend
  // which would verify the payment signature with Razorpay
  console.log('Verifying payment:', paymentResponse);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For demo purposes, always return success
  return true;
};