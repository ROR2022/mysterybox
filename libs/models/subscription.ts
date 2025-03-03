import mongoose from 'mongoose';
import { SubscriptionStatus, SubscriptionPlan } from '@/types/subscription';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['FREE', 'BASIC', 'PREMIUM'] as SubscriptionPlan[],
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'CANCELLED', 'EXPIRED'] as SubscriptionStatus[],
    default: 'ACTIVE'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Crear índices para mejorar el rendimiento de las consultas
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });

export const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema); 