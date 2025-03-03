import mongoose from 'mongoose';
import { InterestCategory, BoxContentType } from '@/libs/types/user';
import { IContent } from '@/libs/types/content';

// Schema para el contenido
const contentSchema = new mongoose.Schema<IContent>({
  title: { 
    type: String, 
    required: true,
    trim: true,
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
  },
  category: { 
    type: String,
    enum: Object.values(InterestCategory),
    required: true,
  },
  type: { 
    type: String,
    enum: Object.values(BoxContentType),
    required: true,
  },
  url: { 
    type: String, 
    required: true,
    trim: true,
  },
  imageUrl: { 
    type: String,
    trim: true,
  },
  points: { 
    type: Number,
    required: true,
    min: 0,
  },
  active: { 
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: {
    type: Number,
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true, // Esto añadirá automáticamente createdAt y updatedAt
});

// Índices para mejorar el rendimiento de las búsquedas
contentSchema.index({ category: 1, type: 1 });
contentSchema.index({ active: 1 });
contentSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Para búsquedas de texto

// Exportar el modelo
export const Content = mongoose.models.Content || mongoose.model<IContent>('Content', contentSchema); 