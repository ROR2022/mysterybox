import mongoose from 'mongoose';
import { InterestCategory, BoxContentType, BoxStatus, IBoxContent, IDigitalBoxModel } from '@/libs/types/user';

const boxContentSchema = new mongoose.Schema<IBoxContent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: Object.values(InterestCategory),
    required: true 
  },
  type: { 
    type: String, 
    enum: Object.values(BoxContentType),
    required: true 
  },
  url: { type: String, required: true },
  imageUrl: String,
  points: { type: Number, default: 10 }
});

const digitalBoxSchema = new mongoose.Schema<IDigitalBoxModel>({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  month: { type: Date, required: true },
  content: [boxContentSchema],
  status: { 
    type: String, 
    enum: Object.values(BoxStatus),
    default: BoxStatus.PENDING
  },
  deliveredAt: { type: Date, required: true },
  openedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las consultas
digitalBoxSchema.index({ userId: 1, month: 1 }, { unique: true });
digitalBoxSchema.index({ status: 1 });
digitalBoxSchema.index({ deliveredAt: 1 });

export const DigitalBox = mongoose.models.DigitalBox || 
  mongoose.model<IDigitalBoxModel>('DigitalBox', digitalBoxSchema); 