import mongoose from 'mongoose';

// Definir el enum para las categorías de intereses
export enum InterestCategory {
  TECNOLOGIA = 'tecnologia',
  ARTE = 'arte',
  MUSICA = 'musica',
  LITERATURA = 'literatura',
  CINE = 'cine',
  GASTRONOMIA = 'gastronomia',
  VIAJES = 'viajes',
  DEPORTES = 'deportes',
  CIENCIA = 'ciencia',
  HISTORIA = 'historia',
  NATURALEZA = 'naturaleza',
  FOTOGRAFIA = 'fotografia',
  GAMING = 'gaming',
  MODA = 'moda',
  SALUD = 'salud',
  EDUCACION = 'educacion'
}

// Definir el enum para los planes de suscripción
export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium'
}

// Definir la interfaz para el usuario (sin dependencias de Mongoose)
export interface IUserProfile {
  bio?: string;
  location?: string;
  website?: string;
}

// Interfaz para el modelo de datos (usado en el servidor)
export interface IUserSubscriptionModel {
  plan: SubscriptionPlan;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  cancelAtPeriodEnd?: boolean;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}

// Interfaz para los props del componente (usado en el cliente)
export interface IUserSubscription {
  plan: SubscriptionPlan;
  active: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  cancelAtPeriodEnd?: boolean;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

export interface IUserNotifications {
  email: boolean;
  push: boolean;
}

export interface IUserData {
  email: string;
  name?: string;
  image?: string;
  interests: InterestCategory[];
  points: number;
  subscription: IUserSubscriptionModel;
  profile: IUserProfile;
  notifications: IUserNotifications;
  createdAt: Date;
  updatedAt: Date;
}

// Box related types
export enum BoxContentType {
  VIDEO = 'Video',
  ARTICULO = 'Artículo',
  PODCAST = 'Podcast',
  CURSO = 'Curso',
  EBOOK = 'Ebook',
  JUEGO = 'Juego',
  EXPERIENCIA = 'Experiencia',
  EVENTO = 'Evento',
  RECURSO = 'Recurso',
  HERRAMIENTA = 'Herramienta'
}

export enum BoxStatus {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  OPENED = 'opened',
  COMPLETED = 'completed'
}

export interface IBoxContent {
  title: string;
  description: string;
  category: InterestCategory;
  type: BoxContentType;
  url: string;
  imageUrl?: string;
  points?: number;
}

// Interfaz para el cliente (con fechas como strings)
export interface IDigitalBox {
  _id?: string;
  userId: string;
  month: string;
  content: IBoxContent[];
  status: BoxStatus;
  deliveredAt: string;
  openedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interfaz para el modelo de datos (con fechas como Date)
export interface IDigitalBoxModel {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  month: Date;
  content: IBoxContent[];
  status: BoxStatus;
  deliveredAt: Date;
  openedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  image?: string;
  interests: InterestCategory[];
  points: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscription {
  id: string;
  userId: string;
  plan: 'basic' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
} 