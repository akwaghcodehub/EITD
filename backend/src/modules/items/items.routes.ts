// backend/src/modules/items/items.routes.ts
import express from 'express';
import { z } from 'zod';
import prisma from '../../db/prismaClient';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

// Validation schemas
const lostItemSchema = z.object({
  itemName: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  dateLost: z.string(),
  location: z.string().min(1),
  imageUrl: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional()
});

const foundItemSchema = z.object({
  itemName: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  dateFound: z.string(),
  locationFound: z.string().min(1),
  currentLocation: z.string().min(1),
  imageUrl: z.string().optional()
});

// ============ LOST ITEMS ============

// Get all lost items (PUBLIC)
router.get('/lost', async (req, res) => {
  try {
    const { category, location, search } = req.query;
    
    const where: any = { status: 'ACTIVE' };
    
    if (category) where.category = category;
    if (location) where.location = location;
    if (search) {
      where.OR = [
        { itemName: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const items = await prisma.lostItem.findMany({
      where,
      include: {
        user: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lost items' });
  }
});

// Get single lost item (PUBLIC)
router.get('/lost/:id', async (req, res) => {
  try {
    const item = await prisma.lostItem.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Report lost item (AUTH REQUIRED)
router.post('/lost', authMiddleware, async (req: any, res) => {
  try {
    const data = lostItemSchema.parse(req.body);

    const item = await prisma.lostItem.create({
      data: {
        ...data,
        dateLost: new Date(data.dateLost),
        userId: req.user.id
      },
      include: {
        user: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    res.status(201).json(item);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to create lost item' });
  }
});

// Update lost item (AUTH REQUIRED - own items only)
router.put('/lost/:id', authMiddleware, async (req: any, res) => {
  try {
    const item = await prisma.lostItem.findUnique({
      where: { id: req.params.id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.lostItem.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete lost item (AUTH REQUIRED - own items only)
router.delete('/lost/:id', authMiddleware, async (req: any, res) => {
  try {
    const item = await prisma.lostItem.findUnique({
      where: { id: req.params.id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.lostItem.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// ============ FOUND ITEMS ============

// Get all found items (PUBLIC)
router.get('/found', async (req, res) => {
  try {
    const { category, location, search } = req.query;
    
    const where: any = { 
      status: { in: ['AVAILABLE', 'CLAIMED'] } // Don't show marketplace items here
    };
    
    if (category) where.category = category;
    if (location) where.locationFound = location;
    if (search) {
      where.OR = [
        { itemName: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const items = await prisma.foundItem.findMany({
      where,
      include: {
        user: {
          select: { firstName: true, lastName: true }
        },
        claims: {
          where: { status: 'APPROVED' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate days until expiration
    const itemsWithExpiry = items.map(item => ({
      ...item,
      daysUntilExpiry: Math.ceil(
        (item.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    }));

    res.json(itemsWithExpiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch found items' });
  }
});

// Get single found item (PUBLIC)
router.get('/found/:id', async (req, res) => {
  try {
    const item = await prisma.foundItem.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        },
        claims: {
          include: {
            claimant: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const daysUntilExpiry = Math.ceil(
      (item.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    res.json({ ...item, daysUntilExpiry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Report found item (AUTH REQUIRED)
router.post('/found', authMiddleware, async (req: any, res) => {
  try {
    const data = foundItemSchema.parse(req.body);

    // Set expiration to 30 days from date found
    const dateFound = new Date(data.dateFound);
    const expiresAt = new Date(dateFound);
    expiresAt.setDate(expiresAt.getDate() + 30);

    const item = await prisma.foundItem.create({
      data: {
        ...data,
        dateFound,
        expiresAt,
        userId: req.user.id
      },
      include: {
        user: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    res.status(201).json(item);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to create found item' });
  }
});

// Update found item (AUTH REQUIRED - own items only)
router.put('/found/:id', authMiddleware, async (req: any, res) => {
  try {
    const item = await prisma.foundItem.findUnique({
      where: { id: req.params.id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.foundItem.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

export default router;
