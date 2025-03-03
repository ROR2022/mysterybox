export enum RewardType {
    SUBSCRIPTION_DISCOUNT = 'subscription_discount',
    EXTRA_CONTENT = 'extra_content',
    SPECIAL_ACCESS = 'special_access',
    CUSTOM_THEME = 'custom_theme',
    PROFILE_BADGE = 'profile_badge'
  }
  
  export interface IReward {
    _id: string;
    title: string;
    description: string;
    type: RewardType;
    pointsCost: number;
    discount?: number; // Para descuentos en suscripción
    duration?: number; // Duración en días para beneficios temporales
    imageUrl?: string;
    active: boolean;
    maxRedemptions?: number; // Límite de veces que se puede canjear en total
    userMaxRedemptions?: number; // Límite de veces que un usuario puede canjear
    expiresAt?: Date; // Fecha de expiración de la recompensa
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface IUserReward {
    _id: string;
    userId: string;
    rewardId: string;
    redeemedAt: Date;
    expiresAt?: Date;
    used: boolean; // Para recompensas que necesitan ser "usadas" (ej: descuentos)
    usedAt?: Date;
  }