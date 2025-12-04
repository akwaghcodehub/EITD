import express, { Request, Response } from 'express';
import Item from '../../models/Item';
import { authMiddleware, AuthRequest } from '../../middleware/authMiddleware';
import { upload } from '../../middleware/upload';


const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, category, location, search } = req.query;
    let query: any = { status: 'active' };

    if (type) query.type = type;
    if (category) query.category = category;
    if (location) query.location = location;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Item.find(query).sort({ createdAt: -1 });
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

router.post('/', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, type, category, location, date, contactEmail, contactPhone } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
    }

    const newItem = new Item({
      title,
      description,
      type,
      category,
      location,
      date,
      imageUrl,
      contactEmail,
      contactPhone,
      userId: req.userId,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating item', error: error.message });
  }
});

router.put('/:id', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.file) {
      req.body.imageUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
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