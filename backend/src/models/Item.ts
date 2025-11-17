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
    type: { type: String, enum: ['lost', 'found'], required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    imageUrl: String,
    contactEmail: { type: String, required: true },
    contactPhone: String,
    status: { type: String, enum: ['active', 'claimed', 'expired'], default: 'active' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IItem>('Item', ItemSchema);
