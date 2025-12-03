import express, { Request, Response } from 'express';
import Item from '../../models/Item';
import Claim from '../../models/Claim';
import User from '../../models/User';
import MarketplaceItem from '../../models/MarketplaceItem';
import { authMiddleware, adminMiddleware, AuthRequest } from '../../middleware/authMiddleware';
import { sendClaimApprovedEmail, sendClaimRejectedEmail } from '../../utils/email'; // ✅ Add this import

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/items', async (req: Request, res: Response) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

router.get('/claims', async (req: Request, res: Response) => {
  try {
    const claims = await Claim.find()
      .populate('itemId')
      .populate('claimantId', 'name email')
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching claims', error: error.message });
  }
});

// ✅ REPLACE THIS ENTIRE ROUTE
router.patch('/claims/:id', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Get claim with populated data
    const claim = await Claim.findById(req.params.id)
      .populate('claimantId', 'name email')
      .populate('itemId', 'title _id');

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Update claim status
    claim.status = status;
    await claim.save();

    // Update item status if approved
    if (status === 'approved') {
      await Item.findByIdAndUpdate(claim.itemId, { status: 'claimed' });
    }

    // ✅ Send email notification
    try {
      const claimant = claim.claimantId as any;
      const item = claim.itemId as any;

      if (status === 'approved') {
        await sendClaimApprovedEmail(
          claimant.email,
          claimant.name,
          item.title,
          item._id.toString()
        );
        console.log('✅ Approval email sent to:', claimant.email);
      } else if (status === 'rejected') {
        await sendClaimRejectedEmail(
          claimant.email,
          claimant.name,
          item.title
        );
        console.log('✅ Rejection email sent to:', claimant.email);
      }
    } catch (emailError) {
      console.error('❌ Failed to send email notification:', emailError);
      // Continue even if email fails - don't block the claim update
    }

    // Return updated claim
    const updatedClaim = await Claim.findById(req.params.id)
      .populate('itemId')
      .populate('claimantId', 'name email');

    res.json(updatedClaim);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating claim', error: error.message });
  }
});

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const totalItems = await Item.countDocuments();
    const activeLost = await Item.countDocuments({ type: 'lost', status: 'active' });
    const activeFound = await Item.countDocuments({ type: 'found', status: 'active' });
    const claimed = await Item.countDocuments({ status: 'claimed' });
    const expired = await Item.countDocuments({ status: 'expired' });
    const marketplaceItems = await MarketplaceItem.countDocuments({ status: 'available' });
    res.json({ totalItems, activeLost, activeFound, claimed, expired, marketplaceItems });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

router.delete('/items/:id', async (req: Request, res: Response) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

export default router;