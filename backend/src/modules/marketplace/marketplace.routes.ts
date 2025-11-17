// backend/src/modules/marketplace/marketplace.routes.ts
import express from 'express';
import prisma from '../../db/prismaClient';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

// Get all marketplace items (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    const where: any = { status: 'AVAILABLE' };
    
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { itemName: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const items = await prisma.marketplaceItem.findMany({
      where,
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

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marketplace items' });
  }
});

// Get single marketplace item (PUBLIC)
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.marketplaceItem.findUnique({
      where: { id: req.params.id },
      include: {
        foundItem: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
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

// Claim marketplace item (AUTH REQUIRED - First come first served!)
router.post('/:id/claim', authMiddleware, async (req: any, res) => {
  try {
    const item = await prisma.marketplaceItem.findUnique({
      where: { id: req.params.id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'Item has already been claimed' });
    }

    // First-come-first-served: whoever clicks first gets it!
    const updated = await prisma.marketplaceItem.update({
      where: { id: req.params.id },
      data: {
        status: 'CLAIMED',
        claimedBy: req.user.id,
        claimedAt: new Date()
      },
      include: {
        foundItem: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
        }
      }
    });

    // TODO: Send email to item owner and claimant with pickup details

    res.json({
      message: 'Item claimed successfully!',
      item: updated,
      pickupLocation: updated.pickupLocation
    });
  } catch (error: any) {
    // Handle race condition where two people try to claim at same time
    if (error.code === 'P2034') {
      return res.status(409).json({ error: 'Someone else just claimed this item' });
    }
    res.status(500).json({ error: 'Failed to claim item' });
  }
});

// Get user's claimed marketplace items (AUTH REQUIRED)
router.get('/my/claimed', authMiddleware, async (req: any, res) => {
  try {
    const items = await prisma.marketplaceItem.findMany({
      where: {
        claimedBy: req.user.id
      },
      include: {
        foundItem: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
        }
      },
      orderBy: { claimedAt: 'desc' }
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch claimed items' });
  }
});

export default router;
