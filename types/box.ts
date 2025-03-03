import { IBoxContent, BoxStatus } from '@/libs/types/user';

export interface Box {
  _id: string;
  userId: string;
  userEmail: string;
  month: string;
  content: IBoxContent[];
  status: BoxStatus;
  deliveredAt: string;
  openedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BoxItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  quantity: number;
} 