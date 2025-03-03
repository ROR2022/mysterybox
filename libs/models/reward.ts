import mongoose from 'mongoose';
import { RewardType, IReward, IUserReward } from '@/libs/types/reward';

// Schema para las recompensas
const rewardSchema = new mongoose.Schema<IReward>({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true,
    trim: true 
  },
  type: { 
    type: String,
    enum: Object.values(RewardType),
    required: true 
  },
  pointsCost: { 
    type: Number, 
    required: true,
    min: 0 
  },
  discount: { 
    type: Number,
    min: 0,
    max: 100 
  },
  duration: { 
    type: Number,
    min: 1 
  },
  imageUrl: String,
  active: { 
    type: Boolean, 
    default: true 
  },
  maxRedemptions: Number,
  userMaxRedemptions: { 
    type: Number, 
    default: 1 
  },
  expiresAt: Date
}, {
  timestamps: true
});

// Schema para las recompensas canjeadas por usuarios
const userRewardSchema = new mongoose.Schema<IUserReward>({
  userId: { 
    type: String, 
    ref: 'User',
    required: true 
  },
  rewardId: { 
    type: String, 
    ref: 'Reward',
    required: true 
  },
  redeemedAt: { 
    type: Date, 
    default: Date.now,
    required: true 
  },
  expiresAt: Date,
  used: { 
    type: Boolean, 
    default: false 
  },
  usedAt: Date
});

// Índices para mejorar el rendimiento
rewardSchema.index({ active: 1, expiresAt: 1 });
rewardSchema.index({ type: 1 });
userRewardSchema.index({ userId: 1, rewardId: 1 });
userRewardSchema.index({ redeemedAt: 1 });

// Exportar los modelos
export const Reward = mongoose.models.Reward || mongoose.model<IReward>('Reward', rewardSchema);
export const UserReward = mongoose.models.UserReward || mongoose.model<IUserReward>('UserReward', userRewardSchema); 