import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './modules/auth/auth.routes';
import itemsRouter from './modules/items/items.routes';
import claimsRouter from './modules/claims/claims.routes';
import marketplaceRouter from './modules/marketplace/marketplace.routes';
import adminRouter from './modules/admin/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - allow frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Illini Lost & Found API is running!',
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api/claims', claimsRouter);
app.use('/api/marketplace', marketplaceRouter);
app.use('/api/admin', adminRouter);

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();