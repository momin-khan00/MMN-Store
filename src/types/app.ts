export interface AppData {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  apkUrl: string;
  iconUrl: string;
  screenshots: string[];
  developerId: string;
  developerName: string;
  status: 'pending' | 'approved' | 'rejected';
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
  size: number;
  permissions: string[];
  rating: number;
  reviewsCount: number;
  featured?: boolean;
}
