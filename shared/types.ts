// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'patient' | 'doctor' | 'admin';
  profileImageUrl?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Medical record types
export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  notes?: string;
  doctorId: string;
  doctorName: string;
}

export interface Allergy {
  id: string;
  name: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface Condition {
  id: string;
  name: string;
  diagnosisDate: string;
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  doctorName?: string;
  patientName?: string;
}

// Health metrics
export interface HealthMetric {
  id: number;
  name: string;
  value: string;
  unit: string;
  trend: 'increasing' | 'decreasing' | 'stable' | 'improving';
  icon: React.ComponentType<{ className?: string }>;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
