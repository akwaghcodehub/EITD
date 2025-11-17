import express, { Request, Response } from 'express';
import Item from '../../models/Item';
import { authMiddleware, AuthRequest } from '../../middleware/authMiddleware';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const filter: any = { status: 'active' };
    if (type && (type === 'lost' || type === 'found')) {
      filter.type = type;
    }
    const items = await Item.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }
    const items = await Item.find({
      $and: [
        { status: 'active' },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } },
          ],
        },
      ],
    }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: 'Error searching items', error: error.message });
  }
});

router.get('/my-items', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const items = await Item.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const newItem = new Item({ ...req.body, userId: req.userId });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating item', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updatedItem);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating item', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

export default router;
