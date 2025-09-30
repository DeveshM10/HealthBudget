import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertDoctorSchema, insertPatientSchema, insertConsultationSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Middleware for parsing JSON
  app.use(express.json());

  // Setup Replit Auth
  await setupAuth(app);

  // Auth routes for Replit Auth
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get healthcare profile information
      let roleProfile = null;
      if (user.userType === 'patient') {
        roleProfile = await storage.getPatientByUserId(userId);
      } else if (user.userType === 'doctor') {
        roleProfile = await storage.getDoctorByUserId(userId);
      }

      // Return enriched user data with role profile
      res.json({
        ...user,
        roleProfile
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Note: Legacy email/password authentication removed in favor of Replit Auth
  // All authentication now flows through /api/login (Replit OIDC)

  // Doctor Search Routes
  app.get('/api/doctors/search', async (req, res) => {
    try {
      const { specialty, city, minRating, maxFee, query } = req.query;
      
      const filters: any = {};
      if (specialty) filters.specialty = specialty as string;
      if (city) filters.city = city as string;
      if (minRating) filters.minRating = parseFloat(minRating as string);
      if (maxFee) filters.maxFee = parseFloat(maxFee as string);

      let doctors = await storage.searchDoctors(filters);
      
      // Text search filter if query provided
      if (query) {
        const searchQuery = (query as string).toLowerCase();
        doctors = doctors.filter(doctor => 
          doctor.fullName.toLowerCase().includes(searchQuery) ||
          doctor.primarySpecialty.toLowerCase().includes(searchQuery) ||
          doctor.bio?.toLowerCase().includes(searchQuery)
        );
      }

      res.json(doctors);
    } catch (error) {
      console.error('Doctor search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/doctors/:id', async (req, res) => {
    try {
      const doctor = await storage.getDoctor(req.params.id);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (error) {
      console.error('Get doctor error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Consultation/Booking Routes
  app.post('/api/consultations', async (req, res) => {
    try {
      // Validate required fields
      const consultationSchema = z.object({
        patientId: z.string(),
        doctorId: z.string(),
        scheduledAt: z.string().datetime(),
        duration: z.number().min(15).max(120).default(30),
        consultationType: z.enum(['video', 'audio', 'chat']).default('video'),
        chiefComplaint: z.string().min(1),
        consultationFee: z.string(),
        platformFee: z.string(),
        totalAmount: z.string()
      });

      const validationResult = consultationSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid consultation data', 
          details: validationResult.error.errors 
        });
      }

      const consultationData = validationResult.data;

      // Verify patient exists
      const patient = await storage.getPatient(consultationData.patientId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      // Verify doctor exists and is verified
      const doctor = await storage.getDoctor(consultationData.doctorId);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      if (doctor.verificationStatus !== 'verified' || !doctor.isActive) {
        return res.status(400).json({ error: 'Doctor is not available for consultations' });
      }

      const consultation = await storage.createConsultation({
        ...consultationData,
        scheduledAt: new Date(consultationData.scheduledAt)
      });

      res.status(201).json(consultation);
    } catch (error) {
      console.error('Create consultation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/consultations/patient/:patientId', async (req, res) => {
    try {
      const consultations = await storage.getPatientConsultations(req.params.patientId);
      res.json(consultations);
    } catch (error) {
      console.error('Get patient consultations error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/consultations/doctor/:doctorId', async (req, res) => {
    try {
      const consultations = await storage.getDoctorConsultations(req.params.doctorId);
      res.json(consultations);
    } catch (error) {
      console.error('Get doctor consultations error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Patient Routes
  app.get('/api/patients/:id', async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      console.error('Get patient error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/patients/user/:userId', async (req, res) => {
    try {
      const patient = await storage.getPatientByUserId(req.params.userId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      console.error('Get patient by user ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Emergency Routes
  app.post('/api/emergency', async (req, res) => {
    try {
      const emergencyCase = await storage.createEmergencyCase(req.body);
      res.status(201).json(emergencyCase);
    } catch (error) {
      console.error('Create emergency case error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/emergency/active', async (req, res) => {
    try {
      const cases = await storage.getActiveEmergencyCases();
      res.json(cases);
    } catch (error) {
      console.error('Get active emergency cases error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Medical Documents Routes
  app.get('/api/medical-documents/patient/:patientId', async (req, res) => {
    try {
      const documents = await storage.getPatientDocuments(req.params.patientId);
      res.json(documents);
    } catch (error) {
      console.error('Get patient documents error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Seed Data Route for Testing (only in development)
  app.post('/api/seed-data', async (req, res) => {
    // Secure this endpoint
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Not found' });
    }
    try {
      // Create sample doctors
      const doctors = [
        {
          fullName: "Dr. Sarah Johnson",
          primarySpecialty: "Cardiology",
          consultationFee: "500.00",
          city: "Mumbai",
          state: "Maharashtra",
          yearsOfExperience: 12,
          rating: "4.8",
          totalConsultations: 1250,
          totalReviews: 856,
          bio: "Specialized in interventional cardiology with extensive experience in heart disease prevention and treatment."
        },
        {
          fullName: "Dr. Raj Patel",
          primarySpecialty: "Dermatology", 
          consultationFee: "350.00",
          city: "Delhi",
          state: "Delhi",
          yearsOfExperience: 8,
          rating: "4.6",
          totalConsultations: 980,
          totalReviews: 642,
          bio: "Expert in skin conditions, cosmetic dermatology, and advanced treatment procedures."
        },
        {
          fullName: "Dr. Priya Sharma",
          primarySpecialty: "Pediatrics",
          consultationFee: "300.00", 
          city: "Bangalore",
          state: "Karnataka",
          yearsOfExperience: 15,
          rating: "4.9",
          totalConsultations: 2100,
          totalReviews: 1845,
          bio: "Dedicated pediatrician with special focus on child development and preventive care."
        },
        {
          fullName: "Dr. Amit Kumar",
          primarySpecialty: "General Medicine",
          consultationFee: "250.00",
          city: "Chennai",
          state: "Tamil Nadu", 
          yearsOfExperience: 10,
          rating: "4.5",
          totalConsultations: 1500,
          totalReviews: 1200,
          bio: "Experienced general physician providing comprehensive primary healthcare services."
        }
      ];

      for (const doctorData of doctors) {
        // Create user account for doctor
        const passwordHash = await bcrypt.hash('password123', 10);
        const user = await storage.createUser({
          email: `${doctorData.fullName.toLowerCase().replace(/[^a-z]/g, '')}@affordcare.com`,
          passwordHash,
          userType: 'doctor',
          password: 'password123'
        });

        // Create doctor profile
        const doctor = await storage.createDoctor({
          userId: user.id,
          fullName: doctorData.fullName,
          medicalLicense: `LIC${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          licenseState: doctorData.state,
          licenseExpiry: '2026-12-31',
          primarySpecialty: doctorData.primarySpecialty,
          medicalSchool: 'All India Institute of Medical Sciences',
          yearsOfExperience: doctorData.yearsOfExperience,
          consultationFee: doctorData.consultationFee,
          city: doctorData.city,
          state: doctorData.state,
          bio: doctorData.bio
        });

        // Update with additional fields that can't be set during creation
        await storage.updateDoctor(doctor.id, {
          rating: doctorData.rating,
          totalConsultations: doctorData.totalConsultations,
          totalReviews: doctorData.totalReviews,
          verificationStatus: 'verified'
        });
      }

      res.json({ message: 'Sample data created successfully', doctorsCreated: doctors.length });
    } catch (error) {
      console.error('Seed data error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
