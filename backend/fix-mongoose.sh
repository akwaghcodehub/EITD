#!/bin/bash

echo "🔧 Converting from Prisma to Mongoose..."

# Step 1: Uninstall Prisma
echo "📦 Removing Prisma..."
npm uninstall prisma @prisma/client

# Step 2: Install Mongoose and dependencies
echo "📦 Installing Mongoose and dependencies..."
npm install mongoose bcryptjs jsonwebtoken
npm install --save-dev @types/mongoose @types/bcryptjs @types/jsonwebtoken

# Step 3: Delete Prisma files
echo "🗑️ Removing Prisma files..."
rm -rf prisma/
rm -f src/db/prismaClient.ts

# Step 4: Create models directory
echo "📁 Creating models directory..."
mkdir -p src/models

# Step 5: Create User Model
echo "📝 Creating User model..."
cat > src/models/User.ts << 'USERMODEL'
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
USERMODEL

# Step 6: Create Item Model
echo "📝 Creating Item model..."
cat > src/models/Item.ts << 'ITEMMODEL'
import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location: string;
  date: Date;
  imageUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'active' | 'claimed' | 'expired';
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    imageUrl: String,
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: String,
    status: {
      type: String,
      enum: ['active', 'claimed', 'expired'],
      default: 'active',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IItem>('Item', ItemSchema);
ITEMMODEL

# Step 7: Create Claim Model
echo "📝 Creating Claim model..."
cat > src/models/Claim.ts << 'CLAIMMODEL'
import mongoose, { Document, Schema } from 'mongoose';

export interface IClaim extends Document {
  itemId: mongoose.Types.ObjectId;
  claimantId: mongoose.Types.ObjectId;
  description: string;
  verificationDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ClaimSchema = new Schema<IClaim>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    claimantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    verificationDetails: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IClaim>('Claim', ClaimSchema);
CLAIMMODEL

# Step 8: Create MarketplaceItem Model
echo "📝 Creating MarketplaceItem model..."
cat > src/models/MarketplaceItem.ts << 'MARKETMODEL'
import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketplaceItem extends Document {
  itemId: mongoose.Types.ObjectId;
  price: number;
  status: 'available' | 'sold';
  listedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MarketplaceItemSchema = new Schema<IMarketplaceItem>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'sold'],
      default: 'available',
    },
    listedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMarketplaceItem>('MarketplaceItem', MarketplaceItemSchema);
MARKETMODEL

# Step 9: Create Auth Middleware
echo "📝 Creating auth middleware..."
cat > src/middleware/authMiddleware.ts << 'AUTHMIDDLEWARE'
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};
AUTHMIDDLEWARE

# Step 10: Update auth.routes.ts
echo "📝 Updating auth routes..."
cat > src/modules/auth/auth.routes.ts << 'AUTHROUTES'
import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
AUTHROUTES

# Step 11: Update items.routes.ts
echo "📝 Updating items routes..."
cat > src/modules/items/items.routes.ts << 'ITEMROUTES'
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
    const newItem = new Item({
      ...req.body,
      userId: req.userId,
    });
    
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
    
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
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
ITEMROUTES

echo ""
echo "✅ Conversion complete!"
echo ""
echo "Next steps:"
echo "1. Make sure .env has JWT_SECRET"
echo "2. Run: npm run dev"
echo "3. Test registration at http://localhost:3000/register"
