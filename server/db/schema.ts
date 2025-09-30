import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Helper function to get current timestamp in SQLite format
const currentTimestamp = () => sql`(strftime('%Y-%m-%d %H:%M:%f', 'now'))`;

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  role: text('role', { enum: ['patient', 'doctor', 'admin'] }).notNull().default('patient'),
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
  avatarUrl: text('avatar_url'),
  createdAt: text('created_at').notNull().default(currentTimestamp() as any),
  updatedAt: text('updated_at').notNull().default(currentTimestamp() as any),
});

export const userSessions = sqliteTable('user_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull().default(currentTimestamp() as any),
});

export const patients = sqliteTable('patients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  dateOfBirth: text('date_of_birth'),
  bloodType: text('blood_type'),
  height: integer('height'),
  weight: integer('weight'),
  allergies: text('allergies', { mode: 'json' }),
  medications: text('medications', { mode: 'json' }),
  medicalHistory: text('medical_history', { mode: 'json' }),
  emergencyContact: text('emergency_contact', { mode: 'json' }),
});

export const doctors = sqliteTable('doctors', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  specialization: text('specialization'),
  licenseNumber: text('license_number'),
  experience: integer('experience'),
  consultationFee: integer('consultation_fee'),
  bio: text('bio'),
  education: text('education', { mode: 'json' }),
  languages: text('languages', { mode: 'json' }),
  isAvailable: integer('is_available', { mode: 'boolean' }).notNull().default(true),
});

export const appointments = sqliteTable('appointments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  doctorId: integer('doctor_id').notNull().references(() => doctors.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  duration: integer('duration').default(30), // in minutes
  status: text('status', { enum: ['scheduled', 'completed', 'cancelled', 'no_show'] }).default('scheduled'),
  reason: text('reason'),
  notes: text('notes'),
  meetingUrl: text('meeting_url'),
  createdAt: text('created_at').notNull().default(currentTimestamp() as any),
  updatedAt: text('updated_at').notNull().default(currentTimestamp() as any),
});

export const medicalRecords = sqliteTable('medical_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  doctorId: integer('doctor_id').references(() => doctors.id, { onDelete: 'set null' }),
  appointmentId: integer('appointment_id').references(() => appointments.id, { onDelete: 'set null' }),
  diagnosis: text('diagnosis'),
  symptoms: text('symptoms', { mode: 'json' }),
  prescription: text('prescription', { mode: 'json' }),
  notes: text('notes'),
  attachments: text('attachments', { mode: 'json' }),
  createdAt: text('created_at').notNull().default(currentTimestamp() as any),
  updatedAt: text('updated_at').notNull().default(currentTimestamp() as any),
});

// Define relations
export const usersRelations = relations(users, ({ one, many }) => ({
  patient: one(patients, {
    fields: [users.id],
    references: [patients.userId],
  }),
  doctor: one(doctors, {
    fields: [users.id],
    references: [doctors.userId],
  }),
  sessions: many(userSessions),
  appointments: many(appointments),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, {
    fields: [patients.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, {
    fields: [doctors.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.id],
  }),
  medicalRecord: one(medicalRecords, {
    fields: [appointments.id],
    references: [medicalRecords.appointmentId],
  }),
}));

export const dentalClinics = sqliteTable('dental_clinics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clinicName: text('clinic_name').notNull(),
  doctorName: text('doctor_name'),
  address: text('address'),
  city: text('city'),
  pinCode: text('pin_code'),
  state: text('state'),
  mobileNumber: text('mobile_number'),
  phoneNumber: text('phone_number'),
  email: text('email'),
  website: text('website'),
  createdAt: text('created_at').notNull().default(currentTimestamp() as any),
  updatedAt: text('updated_at').notNull().default(currentTimestamp() as any),
}, (table) => ({
  // Add any additional indexes here if needed
  clinicNameIdx: index('clinic_name_idx').on(table.clinicName),
  cityIdx: index('city_idx').on(table.city),
  stateIdx: index('state_idx').on(table.state),
  pinCodeIdx: index('pincode_idx').on(table.pinCode),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  patient: one(patients, {
    fields: [medicalRecords.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [medicalRecords.doctorId],
    references: [doctors.id],
  }),
  appointment: one(appointments, {
    fields: [medicalRecords.appointmentId],
    references: [appointments.id],
  }),
}));
