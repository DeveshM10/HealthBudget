import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, decimal, date, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Core User Management - Updated for Replit Auth compatibility
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Healthcare-specific fields
  userType: text("user_type"), // 'patient', 'doctor', 'admin'
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Doctor Profiles with Medical Credentials
export const doctors = pgTable("doctors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  fullName: text("full_name").notNull(),
  profilePhoto: text("profile_photo"),
  // Medical Credentials
  medicalLicense: text("medical_license").notNull(),
  licenseState: text("license_state").notNull(),
  licenseExpiry: date("license_expiry").notNull(),
  // Specialization Details
  primarySpecialty: text("primary_specialty").notNull(),
  subSpecialties: text("sub_specialties").array(),
  certifications: jsonb("certifications"), // Board certifications, fellowships
  // Education & Experience
  medicalSchool: text("medical_school").notNull(),
  residency: text("residency"),
  fellowship: text("fellowship"),
  yearsOfExperience: integer("years_of_experience").notNull(),
  // Practice Details
  consultationFee: decimal("consultation_fee", { precision: 10, scale: 2 }).notNull(),
  availableHours: jsonb("available_hours"), // Weekly schedule
  languages: text("languages").array(),
  // Location & Practice
  city: text("city").notNull(),
  state: text("state").notNull(),
  hospitalAffiliations: text("hospital_affiliations").array(),
  // Professional Details
  bio: text("bio"),
  specialInterests: text("special_interests").array(),
  researchPublications: jsonb("research_publications"),
  awards: jsonb("awards"),
  // Platform Metrics
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalConsultations: integer("total_consultations").default(0),
  totalReviews: integer("total_reviews").default(0),
  isActive: boolean("is_active").default(true),
  verificationStatus: text("verification_status").default("pending"), // pending, verified, suspended
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comprehensive Patient Profiles
export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  fullName: text("full_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  phoneNumber: text("phone_number").notNull(),
  emergencyContact: jsonb("emergency_contact"),
  // Medical Information
  bloodGroup: text("blood_group"),
  height: integer("height"), // in cm
  weight: decimal("weight", { precision: 5, scale: 2 }), // in kg
  allergies: text("allergies").array(),
  chronicConditions: text("chronic_conditions").array(),
  currentMedications: jsonb("current_medications"),
  familyHistory: jsonb("family_history"),
  // Insurance & Financial
  insuranceProvider: text("insurance_provider"),
  insurancePolicyNumber: text("insurance_policy_number"),
  preferredBudgetRange: text("preferred_budget_range"), // basic, specialist, premium
  // Address
  address: jsonb("address"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  // Preferences
  preferredLanguages: text("preferred_languages").array(),
  communicationPreferences: jsonb("communication_preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Consultations with Medical Context
export const consultations = pgTable("consultations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").references(() => patients.id).notNull(),
  doctorId: varchar("doctor_id").references(() => doctors.id).notNull(),
  // Scheduling
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull(), // in minutes
  consultationType: text("consultation_type").notNull(), // video, audio, chat
  // Medical Details
  chiefComplaint: text("chief_complaint").notNull(),
  symptoms: text("symptoms").array(),
  vitalSigns: jsonb("vital_signs"),
  clinicalNotes: text("clinical_notes"),
  diagnosis: text("diagnosis").array(),
  treatmentPlan: text("treatment_plan"),
  prescriptions: jsonb("prescriptions"),
  followUpInstructions: text("follow_up_instructions"),
  referrals: jsonb("referrals"),
  // Session Details
  sessionStarted: timestamp("session_started"),
  sessionEnded: timestamp("session_ended"),
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, cancelled, no_show
  // Financial
  consultationFee: decimal("consultation_fee", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").default("pending"),
  // Quality & Feedback
  patientRating: integer("patient_rating"), // 1-5
  patientFeedback: text("patient_feedback"),
  doctorRating: integer("doctor_rating"), // 1-5 (doctor rates patient)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical Documents & Reports
export const medicalDocuments = pgTable("medical_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").references(() => patients.id).notNull(),
  consultationId: varchar("consultation_id").references(() => consultations.id),
  documentType: text("document_type").notNull(), // prescription, lab_report, imaging, discharge_summary
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedBy: varchar("uploaded_by").references(() => users.id).notNull(),
  // Medical Context
  documentDate: date("document_date"),
  issuingProvider: text("issuing_provider"),
  documentSummary: text("document_summary"),
  tags: text("tags").array(),
  // Access Control
  sharedWith: varchar("shared_with").array(), // user IDs who have access
  expiryDate: date("expiry_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health Monitoring for Chronic Care
export const healthMetrics = pgTable("health_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").references(() => patients.id).notNull(),
  metricType: text("metric_type").notNull(), // blood_pressure, blood_sugar, weight, temperature
  value: jsonb("value").notNull(), // flexible structure for different metric types
  unit: text("unit").notNull(),
  recordedAt: timestamp("recorded_at").notNull(),
  recordedBy: text("recorded_by").notNull(), // patient, doctor, device
  deviceId: text("device_id"), // if recorded by IoT device
  notes: text("notes"),
  isAbnormal: boolean("is_abnormal").default(false),
  alertLevel: text("alert_level"), // normal, warning, critical
  createdAt: timestamp("created_at").defaultNow(),
});

// Care Plans for Chronic Disease Management
export const carePlans = pgTable("care_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").references(() => patients.id).notNull(),
  doctorId: varchar("doctor_id").references(() => doctors.id).notNull(),
  condition: text("condition").notNull(),
  planTitle: text("plan_title").notNull(),
  description: text("description"),
  goals: jsonb("goals"),
  medications: jsonb("medications"),
  lifestyle: jsonb("lifestyle"), // diet, exercise, habits
  monitoringSchedule: jsonb("monitoring_schedule"),
  followUpSchedule: jsonb("follow_up_schedule"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  status: text("status").notNull().default("active"), // active, completed, paused, cancelled
  adherenceScore: decimal("adherence_score", { precision: 3, scale: 1 }), // 0-100
  lastReviewed: timestamp("last_reviewed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emergency Cases with Priority Handling
export const emergencyCases = pgTable("emergency_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").references(() => patients.id).notNull(),
  assignedDoctorId: varchar("assigned_doctor_id").references(() => doctors.id),
  emergencyType: text("emergency_type").notNull(), // critical, urgent, semi_urgent
  triageLevel: integer("triage_level").notNull(), // 1-5 priority
  symptoms: text("symptoms").array(),
  vitalSigns: jsonb("vital_signs"),
  location: jsonb("location"),
  contactNumber: text("contact_number").notNull(),
  emergencyContact: jsonb("emergency_contact"),
  status: text("status").notNull().default("open"), // open, assigned, in_progress, resolved, escalated
  responseTime: integer("response_time"), // minutes from creation to first contact
  resolutionTime: integer("resolution_time"), // minutes from creation to resolution
  escalatedTo: text("escalated_to"), // hospital, ambulance, specialist
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Schema exports for forms and validation
// Replit Auth specific types
export type UpsertUser = typeof users.$inferInsert;

// Healthcare-specific user creation schema
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  userType: true,
}).extend({
  userType: z.enum(["patient", "doctor", "admin"]).optional(),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  totalConsultations: true,
  totalReviews: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  sessionStarted: true,
  sessionEnded: true,
});

export const insertMedicalDocumentSchema = createInsertSchema(medicalDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertCarePlanSchema = createInsertSchema(carePlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmergencyCaseSchema = createInsertSchema(emergencyCases).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type MedicalDocument = typeof medicalDocuments.$inferSelect;
export type InsertMedicalDocument = z.infer<typeof insertMedicalDocumentSchema>;
export type HealthMetric = typeof healthMetrics.$inferSelect;
export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;
export type CarePlan = typeof carePlans.$inferSelect;
export type InsertCarePlan = z.infer<typeof insertCarePlanSchema>;
export type EmergencyCase = typeof emergencyCases.$inferSelect;
export type InsertEmergencyCase = z.infer<typeof insertEmergencyCaseSchema>;
