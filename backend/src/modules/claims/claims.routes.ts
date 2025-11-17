import express, { Request, Response } from 'express';
import Claim from '../../models/Claim';
import { authMiddleware, AuthRequest } from '../../middleware/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { itemId, description, verificationDetails } = req.body;
    if (!itemId || !description || !verificationDetails) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }
    const newClaim = new Claim({
      itemId,
      claimantId: req.userId,
      description,
      verificationDetails,
    });
    const savedClaim = await newClaim.save();
    res.status(201).json(savedClaim);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating claim', error: error.message });
  }
});

router.get('/my-claims', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const claims = await Claim.find({ claimantId: req.userId })
      .populate('itemId')
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching claims', error: error.message });
  }
});

router.get('/item/:itemId', async (req: Request, res: Response) => {
  try {
    const claims = await Claim.find({ itemId: req.params.itemId })
      .populate('claimantId', 'name email')
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching claims', error: error.message });
  }
});

export default router;
