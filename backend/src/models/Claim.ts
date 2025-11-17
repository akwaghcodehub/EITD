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
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    claimantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    verificationDetails: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IClaim>('Claim', ClaimSchema);
