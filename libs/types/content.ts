import { InterestCategory, BoxContentType } from './user';

export interface IContent {
  _id: string;
  title: string;
  description: string;
  category: InterestCategory;
  type: BoxContentType;
  url: string;
  imageUrl?: string;
  points: number;
  active: boolean;
  featured?: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // en minutos
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IContentCreateInput {
  title: string;
  description: string;
  category: InterestCategory;
  type: BoxContentType;
  url: string;
  imageUrl?: string;
  points: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  tags: string[];
}

export interface IContentUpdateInput extends Partial<IContentCreateInput> {
  active?: boolean;
  featured?: boolean;
} 