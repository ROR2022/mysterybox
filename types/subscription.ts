import { Types } from 'mongoose';

export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PREMIUM';

export interface Subscription {
  _id: string;
  userId: Types.ObjectId;
  userEmail: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
} 