// backend/src/modules/claims/claims.routes.ts
import express from 'express';
import { z } from 'zod';
import prisma from '../../db/prismaClient';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

const claimSchema = z.object({
  foundItemId: z.string(),
  description: z.string().min(10, 'Please provide detailed description'),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  additionalInfo: z.string().optional()
});

// Submit claim (AUTH REQUIRED)
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const data = claimSchema.parse(req.body);

    // Check if item exists and is available
    const item = await prisma.foundItem.findUnique({
      where: { id: data.foundItemId }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'Item is no longer available for claiming' });
    }

    // Check if user already has pending claim on this item
    const existingClaim = await prisma.claim.findFirst({
      where: {
        foundItemId: data.foundItemId,
        claimantId: req.user.id,
        status: 'PENDING'
      }
    });

    if (existingClaim) {
      return res.status(400).json({ error: 'You already have a pending claim on this item' });
    }

    const claim = await prisma.claim.create({
      data: {
        ...data,
        claimantId: req.user.id
      },
      include: {
        foundItem: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
        },
        claimant: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    // TODO: Send email notification to item owner

    res.status(201).json(claim);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to submit claim' });
  }
});

// Get user's claims (AUTH REQUIRED)
router.get('/my-claims', authMiddleware, async (req: any, res) => {
  try {
    const claims = await prisma.claim.findMany({
      where: { claimantId: req.user.id },
      include: {
        foundItem: {
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

// Get claims for user's found items (AUTH REQUIRED)
router.get('/for-my-items', authMiddleware, async (req: any, res) => {
  try {
    const claims = await prisma.claim.findMany({
      where: {
        foundItem: {
          userId: req.user.id
        }
      },
      include: {
        foundItem: true,
        claimant: {
          select: { firstName: true, lastName: true, email: true, phone: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

// Get single claim details (AUTH REQUIRED)
router.get('/:id', authMiddleware, async (req: any, res) => {
  try {
    const claim = await prisma.claim.findUnique({
      where: { id: req.params.id },
      include: {
        foundItem: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
        },
        claimant: {
          select: { firstName: true, lastName: true, email: true, phone: true }
        }
      }
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Check if user is the claimant or item owner
    if (claim.claimantId !== req.user.id && claim.foundItem.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(claim);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch claim' });
  }
});

export default router;
