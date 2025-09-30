import { Request, Response, Router } from 'express';
import { db } from '../db/index.js';
import { dentalClinics } from '../db/schema.js';
import { and, eq, ilike, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { validate } from '../middleware/validate-request.js';
import { authenticate } from '../middleware/auth.js';

// Schema for clinic creation/update
const clinicSchema = z.object({
  body: z.object({
    clinicName: z.string().min(1, 'Clinic name is required'),
    doctorName: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    pinCode: z.string().optional(),
    state: z.string().optional(),
    mobileNumber: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email('Invalid email').optional(),
    website: z.string().url('Invalid URL').or(z.literal('')).optional().nullable(),
  })
});

const updateClinicSchema = z.object({
  body: z.object({
    clinicName: z.string().min(1, 'Clinic name is required').optional(),
    doctorName: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    pinCode: z.string().optional(),
    state: z.string().optional(),
    mobileNumber: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email('Invalid email').optional(),
    website: z.string().url('Invalid URL').or(z.literal('')).optional().nullable(),
  })
});

const router = Router();


// GET /api/clinics - List all clinics with optional filters
router.get('/', async (req, res) => {
  try {
    const { city, state, search, limit = '10', page = '1' } = req.query;
    const limitNum = Math.min(parseInt(limit as string) || 10, 100);
    const pageNum = Math.max(parseInt(page as string) || 1, 1);
    const offset = (pageNum - 1) * limitNum;

    // Build the where clause based on query params
    const whereClause = [];
    
    if (city) whereClause.push(ilike(dentalClinics.city, `%${city}%`));
    if (state) whereClause.push(ilike(dentalClinics.state, `%${state}%`));
    
    if (search) {
      const searchTerm = `%${search}%`;
      whereClause.push(
        or(
          ilike(dentalClinics.clinicName, searchTerm),
          ilike(dentalClinics.doctorName, searchTerm),
          ilike(dentalClinics.address, searchTerm),
          ilike(dentalClinics.city, searchTerm)
        )
      );
    }

    // Get paginated results
    const [clinics, [{ count }]] = await Promise.all([
      db
        .select()
        .from(dentalClinics)
        .where(whereClause.length > 0 ? and(...whereClause) : undefined)
        .limit(limitNum)
        .offset(offset)
        .orderBy(dentalClinics.clinicName),
      
      db
        .select({ count: sql<number>`count(*)` })
        .from(dentalClinics)
        .where(whereClause.length > 0 ? and(...whereClause) : undefined)
    ]);

    res.json({
      success: true,
      data: clinics,
      pagination: {
        total: Number(count),
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(Number(count) / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching clinics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch clinics' });
  }
});

// GET /api/clinics/:id - Get a specific clinic by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const clinic = await db.query.dentalClinics.findFirst({
      where: eq(dentalClinics.id, parseInt(id)),
    });

    if (!clinic) {
      return res.status(404).json({ success: false, error: 'Clinic not found' });
    }

    res.json({ success: true, data: clinic });
  } catch (error) {
    console.error('Error fetching clinic:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch clinic' });
  }
});

// POST /api/clinics - Create a new clinic (admin only)
router.post(
  '/',
  authenticate(['admin']),
  validate(clinicSchema),
  async (req: Request, res: Response) => {
    try {
      const clinicData = req.body;
      
      const [newClinic] = await db
        .insert(dentalClinics)
        .values({
          ...clinicData,
          // Ensure website is not an empty string
          website: clinicData.website || null,
        })
        .returning();

      res.status(201).json({ success: true, data: newClinic });
    } catch (error) {
      console.error('Error creating clinic:', error);
      res.status(500).json({ success: false, error: 'Failed to create clinic' });
    }
  }
);

// PUT /api/clinics/:id - Update a clinic (admin only)
router.put(
  '/:id',
  authenticate(['admin']),
  validate(updateClinicSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if clinic exists
      const existingClinic = await db.query.dentalClinics.findFirst({
        where: eq(dentalClinics.id, parseInt(id)),
      });

      if (!existingClinic) {
        return res.status(404).json({ success: false, error: 'Clinic not found' });
      }

      // Update clinic
      const [updatedClinic] = await db
        .update(dentalClinics)
        .set({
          ...updateData,
          updatedAt: new Date(),
          // Only update website if it's provided
          ...(updateData.website !== undefined && {
            website: updateData.website || null,
          }),
        })
        .where(eq(dentalClinics.id, parseInt(id)))
        .returning();

      res.json({ success: true, data: updatedClinic });
    } catch (error) {
      console.error('Error updating clinic:', error);
      res.status(500).json({ success: false, error: 'Failed to update clinic' });
    }
  }
);

// DELETE /api/clinics/:id - Delete a clinic (admin only)
router.delete('/:id', authenticate(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if clinic exists
    const existingClinic = await db.query.dentalClinics.findFirst({
      where: eq(dentalClinics.id, parseInt(id)),
    });

    if (!existingClinic) {
      return res.status(404).json({ success: false, error: 'Clinic not found' });
    }

    // Delete clinic
    await db.delete(dentalClinics).where(eq(dentalClinics.id, parseInt(id)));

    res.json({ success: true, message: 'Clinic deleted successfully' });
  } catch (error) {
    console.error('Error deleting clinic:', error);
    res.status(500).json({ success: false, error: 'Failed to delete clinic' });
  }
});

export default router;
