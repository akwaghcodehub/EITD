import express, { Request, Response } from 'express';
import MarketplaceItem from '../../models/MarketplaceItem';
import { authMiddleware, adminMiddleware, AuthRequest } from '../../middleware/authMiddleware';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const items = await MarketplaceItem.find({ status: 'available' })
      .populate('itemId')
      .sort({ listedAt: -1 });
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching marketplace items', error: error.message });
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { itemId, price } = req.body;
    if (!itemId || !price || price < 0) {
      return res.status(400).json({ message: 'Valid itemId and price required' });
    }
    const newMarketplaceItem = new MarketplaceItem({ itemId, price });
    const savedItem = await newMarketplaceItem.save();
    const populatedItem = await MarketplaceItem.findById(savedItem._id).populate('itemId');
    res.status(201).json(populatedItem);
  } catch (error: any) {
    res.status(400).json({ message: 'Error listing item', error: error.message });
  }
});

router.patch('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!['available', 'sold'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const updatedItem = await MarketplaceItem.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('itemId');
    if (!updatedItem) {
      return res.status(404).json({ message: 'Marketplace item not found' });
    }
    res.json(updatedItem);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating marketplace item', error: error.message });
  }
});

export default router;
