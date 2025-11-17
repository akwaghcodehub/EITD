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
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
    listedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IMarketplaceItem>('MarketplaceItem', MarketplaceItemSchema);
