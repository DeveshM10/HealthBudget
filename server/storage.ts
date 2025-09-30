import { 
  type User, 
  type InsertUser,
  type UpsertUser,
  type Doctor, 
  type InsertDoctor,
  type Patient,
  type InsertPatient,
  type Consultation,
  type InsertConsultation,
  type MedicalDocument,
  type InsertMedicalDocument,
  type HealthMetric,
  type InsertHealthMetric,
  type CarePlan,
  type InsertCarePlan,
  type EmergencyCase,
  type InsertEmergencyCase
} from "@shared/schema";
import { randomUUID } from "crypto";

// Comprehensive storage interface for healthcare platform
export interface IStorage {
  // User Management (includes Replit Auth required methods)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  // Required for Replit Auth
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Doctor Management
  getDoctor(id: string): Promise<Doctor | undefined>;
  getDoctorByUserId(userId: string): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor | undefined>;
  searchDoctors(filters: {
    specialty?: string;
    city?: string;
    minRating?: number;
    maxFee?: number;
    availability?: string;
  }): Promise<Doctor[]>;
  
  // Patient Management
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientByUserId(userId: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | undefined>;
  
  // Consultation Management
  getConsultation(id: string): Promise<Consultation | undefined>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  updateConsultation(id: string, updates: Partial<Consultation>): Promise<Consultation | undefined>;
  getPatientConsultations(patientId: string): Promise<Consultation[]>;
  getDoctorConsultations(doctorId: string): Promise<Consultation[]>;
  
  // Medical Document Management
  getMedicalDocument(id: string): Promise<MedicalDocument | undefined>;
  createMedicalDocument(document: InsertMedicalDocument): Promise<MedicalDocument>;
  getPatientDocuments(patientId: string): Promise<MedicalDocument[]>;
  
  // Health Metrics for Chronic Care
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  getPatientHealthMetrics(patientId: string, metricType?: string): Promise<HealthMetric[]>;
  
  // Care Plan Management
  getCarePlan(id: string): Promise<CarePlan | undefined>;
  createCarePlan(carePlan: InsertCarePlan): Promise<CarePlan>;
  getPatientCarePlans(patientId: string): Promise<CarePlan[]>;
  
  // Emergency Case Management
  createEmergencyCase(emergencyCase: InsertEmergencyCase): Promise<EmergencyCase>;
  getEmergencyCase(id: string): Promise<EmergencyCase | undefined>;
  getActiveEmergencyCases(): Promise<EmergencyCase[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private doctors: Map<string, Doctor>;
  private patients: Map<string, Patient>;
  private consultations: Map<string, Consultation>;
  private medicalDocuments: Map<string, MedicalDocument>;
  private healthMetrics: Map<string, HealthMetric>;
  private carePlans: Map<string, CarePlan>;
  private emergencyCases: Map<string, EmergencyCase>;

  constructor() {
    this.users = new Map();
    this.doctors = new Map();
    this.patients = new Map();
    this.consultations = new Map();
    this.medicalDocuments = new Map();
    this.healthMetrics = new Map();
    this.carePlans = new Map();
    this.emergencyCases = new Map();
  }

  // User Management Implementation
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Required for Replit Auth - upserts user from OAuth claims
  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = userData.id ? this.users.get(userData.id) : undefined;
    
    if (existingUser) {
      // Update existing user
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: new Date(),
      };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    } else {
      // Create new user
      const id = userData.id || randomUUID();
      const user: User = {
        id,
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        userType: userData.userType || null,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(id, user);
      return user;
    }
  }

  // Doctor Management Implementation
  async getDoctor(id: string): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async getDoctorByUserId(userId: string): Promise<Doctor | undefined> {
    return Array.from(this.doctors.values()).find(
      (doctor) => doctor.userId === userId,
    );
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = randomUUID();
    const doctor: Doctor = {
      ...insertDoctor,
      id,
      profilePhoto: insertDoctor.profilePhoto || null,
      subSpecialties: insertDoctor.subSpecialties || null,
      certifications: insertDoctor.certifications || null,
      residency: insertDoctor.residency || null,
      fellowship: insertDoctor.fellowship || null,
      languages: insertDoctor.languages || null,
      hospitalAffiliations: insertDoctor.hospitalAffiliations || null,
      bio: insertDoctor.bio || null,
      specialInterests: insertDoctor.specialInterests || null,
      researchPublications: insertDoctor.researchPublications || null,
      awards: insertDoctor.awards || null,
      availableHours: insertDoctor.availableHours || null,
      rating: "0.00",
      totalConsultations: 0,
      totalReviews: 0,
      isActive: true,
      verificationStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.doctors.set(id, doctor);
    return doctor;
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor | undefined> {
    const doctor = this.doctors.get(id);
    if (!doctor) return undefined;
    
    const updatedDoctor = { ...doctor, ...updates, updatedAt: new Date() };
    this.doctors.set(id, updatedDoctor);
    return updatedDoctor;
  }

  async searchDoctors(filters: {
    specialty?: string;
    city?: string;
    minRating?: number;
    maxFee?: number;
    availability?: string;
  }): Promise<Doctor[]> {
    return Array.from(this.doctors.values()).filter(doctor => {
      if (filters.specialty && doctor.primarySpecialty !== filters.specialty) return false;
      if (filters.city && doctor.city !== filters.city) return false;
      if (filters.minRating && parseFloat(doctor.rating || "0") < filters.minRating) return false;
      if (filters.maxFee && parseFloat(doctor.consultationFee) > filters.maxFee) return false;
      return doctor.isActive && doctor.verificationStatus === "verified";
    });
  }

  // Patient Management Implementation
  async getPatient(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientByUserId(userId: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.userId === userId,
    );
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const patient: Patient = {
      ...insertPatient,
      id,
      emergencyContact: insertPatient.emergencyContact || null,
      bloodGroup: insertPatient.bloodGroup || null,
      height: insertPatient.height || null,
      weight: insertPatient.weight || null,
      allergies: insertPatient.allergies || null,
      chronicConditions: insertPatient.chronicConditions || null,
      currentMedications: insertPatient.currentMedications || null,
      familyHistory: insertPatient.familyHistory || null,
      insuranceProvider: insertPatient.insuranceProvider || null,
      insurancePolicyNumber: insertPatient.insurancePolicyNumber || null,
      preferredBudgetRange: insertPatient.preferredBudgetRange || null,
      address: insertPatient.address || null,
      preferredLanguages: insertPatient.preferredLanguages || null,
      communicationPreferences: insertPatient.communicationPreferences || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | undefined> {
    const patient = this.patients.get(id);
    if (!patient) return undefined;
    
    const updatedPatient = { ...patient, ...updates, updatedAt: new Date() };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  // Consultation Management Implementation
  async getConsultation(id: string): Promise<Consultation | undefined> {
    return this.consultations.get(id);
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = randomUUID();
    const consultation: Consultation = {
      ...insertConsultation,
      id,
      symptoms: insertConsultation.symptoms || null,
      vitalSigns: insertConsultation.vitalSigns || null,
      clinicalNotes: insertConsultation.clinicalNotes || null,
      diagnosis: insertConsultation.diagnosis || null,
      treatmentPlan: insertConsultation.treatmentPlan || null,
      prescriptions: insertConsultation.prescriptions || null,
      followUpInstructions: insertConsultation.followUpInstructions || null,
      referrals: insertConsultation.referrals || null,
      sessionStarted: null,
      sessionEnded: null,
      status: "scheduled",
      paymentStatus: "pending",
      patientRating: null,
      patientFeedback: null,
      doctorRating: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.consultations.set(id, consultation);
    return consultation;
  }

  async updateConsultation(id: string, updates: Partial<Consultation>): Promise<Consultation | undefined> {
    const consultation = this.consultations.get(id);
    if (!consultation) return undefined;
    
    const updatedConsultation = { ...consultation, ...updates, updatedAt: new Date() };
    this.consultations.set(id, updatedConsultation);
    return updatedConsultation;
  }

  async getPatientConsultations(patientId: string): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      consultation => consultation.patientId === patientId
    );
  }

  async getDoctorConsultations(doctorId: string): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      consultation => consultation.doctorId === doctorId
    );
  }

  // Medical Document Management Implementation
  async getMedicalDocument(id: string): Promise<MedicalDocument | undefined> {
    return this.medicalDocuments.get(id);
  }

  async createMedicalDocument(insertDocument: InsertMedicalDocument): Promise<MedicalDocument> {
    const id = randomUUID();
    const document: MedicalDocument = {
      ...insertDocument,
      id,
      consultationId: insertDocument.consultationId || null,
      fileSize: insertDocument.fileSize || null,
      mimeType: insertDocument.mimeType || null,
      documentDate: insertDocument.documentDate || null,
      issuingProvider: insertDocument.issuingProvider || null,
      documentSummary: insertDocument.documentSummary || null,
      tags: insertDocument.tags || null,
      sharedWith: insertDocument.sharedWith || null,
      expiryDate: insertDocument.expiryDate || null,
      isActive: true,
      createdAt: new Date()
    };
    this.medicalDocuments.set(id, document);
    return document;
  }

  async getPatientDocuments(patientId: string): Promise<MedicalDocument[]> {
    return Array.from(this.medicalDocuments.values()).filter(
      document => document.patientId === patientId && document.isActive
    );
  }

  // Health Metrics Implementation
  async createHealthMetric(insertMetric: InsertHealthMetric): Promise<HealthMetric> {
    const id = randomUUID();
    const metric: HealthMetric = {
      ...insertMetric,
      id,
      deviceId: insertMetric.deviceId || null,
      notes: insertMetric.notes || null,
      alertLevel: insertMetric.alertLevel || null,
      isAbnormal: false,
      createdAt: new Date()
    };
    this.healthMetrics.set(id, metric);
    return metric;
  }

  async getPatientHealthMetrics(patientId: string, metricType?: string): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values()).filter(
      metric => metric.patientId === patientId && 
      (!metricType || metric.metricType === metricType)
    );
  }

  // Care Plan Implementation
  async getCarePlan(id: string): Promise<CarePlan | undefined> {
    return this.carePlans.get(id);
  }

  async createCarePlan(insertCarePlan: InsertCarePlan): Promise<CarePlan> {
    const id = randomUUID();
    const carePlan: CarePlan = {
      ...insertCarePlan,
      id,
      description: insertCarePlan.description || null,
      goals: insertCarePlan.goals || null,
      medications: insertCarePlan.medications || null,
      lifestyle: insertCarePlan.lifestyle || null,
      monitoringSchedule: insertCarePlan.monitoringSchedule || null,
      followUpSchedule: insertCarePlan.followUpSchedule || null,
      endDate: insertCarePlan.endDate || null,
      adherenceScore: insertCarePlan.adherenceScore || null,
      lastReviewed: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.carePlans.set(id, carePlan);
    return carePlan;
  }

  async getPatientCarePlans(patientId: string): Promise<CarePlan[]> {
    return Array.from(this.carePlans.values()).filter(
      carePlan => carePlan.patientId === patientId
    );
  }

  // Emergency Case Implementation
  async createEmergencyCase(insertEmergencyCase: InsertEmergencyCase): Promise<EmergencyCase> {
    const id = randomUUID();
    const emergencyCase: EmergencyCase = {
      ...insertEmergencyCase,
      id,
      assignedDoctorId: insertEmergencyCase.assignedDoctorId || null,
      symptoms: insertEmergencyCase.symptoms || null,
      vitalSigns: insertEmergencyCase.vitalSigns || null,
      location: insertEmergencyCase.location || null,
      emergencyContact: insertEmergencyCase.emergencyContact || null,
      responseTime: null,
      resolutionTime: null,
      escalatedTo: null,
      notes: null,
      resolvedAt: null,
      status: "open",
      createdAt: new Date()
    };
    this.emergencyCases.set(id, emergencyCase);
    return emergencyCase;
  }

  async getEmergencyCase(id: string): Promise<EmergencyCase | undefined> {
    return this.emergencyCases.get(id);
  }

  async getActiveEmergencyCases(): Promise<EmergencyCase[]> {
    return Array.from(this.emergencyCases.values()).filter(
      emergencyCase => emergencyCase.status !== "resolved"
    );
  }
}

export const storage = new MemStorage();
