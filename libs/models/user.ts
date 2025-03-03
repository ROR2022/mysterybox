import mongoose from 'mongoose';
import { InterestCategory, SubscriptionPlan, IUserData } from '@/libs/types/user';

// Extend the IUserData interface with Mongoose Document
export interface IUser extends IUserData, mongoose.Document {}

// Re-export the types and enums for convenience
export { InterestCategory, SubscriptionPlan };

// Definir el esquema de usuario
const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: String,
  image: String,
  interests: [{
    type: String,
    enum: Object.values(InterestCategory),
    default: []
  }],
  points: { type: Number, default: 0 },
  subscription: {
    plan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      default: SubscriptionPlan.FREE
    },
    active: { type: Boolean, default: false },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    stripePriceId: String,
    cancelAtPeriodEnd: { type: Boolean, default: false },
    currentPeriodStart: Date,
    currentPeriodEnd: Date
  },
  profile: {
    bio: String,
    location: String,
    website: String
  },
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  }
}, {
  timestamps: true // Esto añadirá automáticamente createdAt y updatedAt
});

// Crear y exportar el modelo
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 