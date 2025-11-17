// backend/src/modules/admin/admin.routes.ts
import express from 'express';
import prisma from '../../db/prismaClient';
import { authMiddleware, adminMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

// All routes require admin authentication
router.use(authMiddleware, adminMiddleware);

// Get all pending claims
router.get('/claims/pending', async (req, res) => {
  try {
    const claims = await prisma.claim.findMany({
      where: { status: 'PENDING' },
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

// Approve claim
router.put('/claims/:id/approve', async (req: any, res) => {
  try {
    const { reviewNotes } = req.body;

    const claim = await prisma.claim.findUnique({
      where: { id: req.params.id },
      include: { foundItem: true }
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (claim.status !== 'PENDING') {
      return res.status(400).json({ error: 'Claim already processed' });
    }

    // Approve claim and mark item as claimed
    const [updatedClaim, updatedItem] = await prisma.$transaction([
      prisma.claim.update({
        where: { id: req.params.id },
        data: {
          status: 'APPROVED',
          reviewedBy: req.user.id,
          reviewNotes,
          reviewedAt: new Date()
        },
        include: {
          claimant: {
            select: { firstName: true, lastName: true, email: true }
          },
          foundItem: true
        }
      }),
      prisma.foundItem.update({
        where: { id: claim.foundItemId },
        data: { status: 'CLAIMED' }
      })
    ]);

    // TODO: Send approval email to claimant

    res.json(updatedClaim);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve claim' });
  }
});

// Reject claim
router.put('/claims/:id/reject', async (req: any, res) => {
  try {
    const { reviewNotes } = req.body;

    const claim = await prisma.claim.findUnique({
      where: { id: req.params.id }
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (claim.status !== 'PENDING') {
      return res.status(400).json({ error: 'Claim already processed' });
    }

    const updatedClaim = await prisma.claim.update({
      where: { id: req.params.id },
      data: {
        status: 'REJECTED',
        reviewedBy: req.user.id,
        reviewNotes,
        reviewedAt: new Date()
      },
      include: {
        claimant: {
          select: { firstName: true, lastName: true, email: true }
        },
        foundItem: true
      }
    });

    // TODO: Send rejection email to claimant

    res.json(updatedClaim);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject claim' });
  }
});

// Get all found items (for admin dashboard)
router.get('/items/found', async (req, res) => {
  try {
    const { status } = req.query;
    
    const where: any = {};
    if (status) where.status = status;

    const items = await prisma.foundItem.findMany({
      where,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        },
        claims: {
          where: { status: 'PENDING' },
          include: {
            claimant: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add expiry info
    const itemsWithExpiry = items.map(item => ({
      ...item,
      daysUntilExpiry: Math.ceil(
        (item.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      ),
      isExpiring: item.expiresAt.getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000 // 3 days
    }));

    res.json(itemsWithExpiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get items expiring soon (within 7 days)
router.get('/items/expiring', async (req, res) => {
  try {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const items = await prisma.foundItem.findMany({
      where: {
        status: 'AVAILABLE',
        expiresAt: {
          lte: sevenDaysFromNow,
          gt: new Date()
        }
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        },
        claims: {
          where: { status: 'PENDING' }
        }
      },
      orderBy: { expiresAt: 'asc' }
    });

    const itemsWithExpiry = items.map(item => ({
      ...item,
      daysUntilExpiry: Math.ceil(
        (item.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    }));

    res.json(itemsWithExpiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expiring items' });
  }
});

// Extend hold period (add 7 days)
router.put('/items/:id/extend', async (req, res) => {
  try {
    const item = await prisma.foundItem.findUnique({
      where: { id: req.params.id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'Can only extend available items' });
    }

    const newExpiryDate = new Date(item.expiresAt);
    newExpiryDate.setDate(newExpiryDate.getDate() + 7);

    const updated = await prisma.foundItem.update({
      where: { id: req.params.id },
      data: { expiresAt: newExpiryDate },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    res.json({
      ...updated,
      daysUntilExpiry: Math.ceil(
        (updated.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to extend hold period' });
  }
});

// Push to marketplace (ADMIN ONLY)
router.post('/items/:id/to-marketplace', async (req, res) => {
  try {
    const { pickupLocation } = req.body;

    if (!pickupLocation) {
      return res.status(400).json({ error: 'Pickup location required' });
    }

    const item = await prisma.foundItem.findUnique({
      where: { id: req.params.id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'Item must be available to move to marketplace' });
    }

    // Create marketplace item and update found item status
    const [marketplaceItem, updatedFoundItem] = await prisma.$transaction([
      prisma.marketplaceItem.create({
        data: {
          foundItemId: item.id,
          itemName: item.itemName,
          category: item.category,
          description: item.description,
          imageUrl: item.imageUrl,
          pickupLocation
        }
      }),
      prisma.foundItem.update({
        where: { id: req.params.id },
        data: { status: 'MARKETPLACE' }
      })
    ]);

    res.json(marketplaceItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to move item to marketplace' });
  }
});

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalLostItems,
      totalFoundItems,
      availableFoundItems,
      pendingClaims,
      approvedClaims,
      marketplaceItems,
      expiringItems
    ] = await Promise.all([
      prisma.lostItem.count({ where: { status: 'ACTIVE' } }),
      prisma.foundItem.count(),
      prisma.foundItem.count({ where: { status: 'AVAILABLE' } }),
      prisma.claim.count({ where: { status: 'PENDING' } }),
      prisma.claim.count({ where: { status: 'APPROVED' } }),
      prisma.marketplaceItem.count({ where: { status: 'AVAILABLE' } }),
      prisma.foundItem.count({
        where: {
          status: 'AVAILABLE',
          expiresAt: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    res.json({
      totalLostItems,
      totalFoundItems,
      availableFoundItems,
      pendingClaims,
      approvedClaims,
      marketplaceItems,
      expiringItems
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
