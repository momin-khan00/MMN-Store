import { Timestamp } from 'firebase/firestore';

export type AppStatus = "pending" | "approved" | "rejected";

export interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  apkUrl: string;       // Supabase Storage URL
  iconUrl: string;      // Supabase Storage URL
  screenshots: string[]; // Array of Supabase Storage URLs
  developerId: string;
  status: AppStatus;
  downloadCount: number;
  createdAt: Timestamp | Date;
  // Optional fields
  rating?: number;
  reviewCount?: number;
}
