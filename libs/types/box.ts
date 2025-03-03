import { InterestCategory, BoxContentType, BoxStatus } from './user';

export { BoxContentType, BoxStatus };

export interface IBoxContent {
  title: string;
  description: string;
  category: InterestCategory;
  type: BoxContentType;
  url: string;
  imageUrl?: string;
  points?: number;
}

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