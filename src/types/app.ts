import { Timestamp } from 'firebase/firestore';

export type AppStatus = "pending" | "approved" | "rejected";

export interface App {
  id: string;
  name: string;
  category: string;
  developerName: string;
  iconUrl: string;
  rating?: number;
  description: string;
  version: string;
  apkUrl: string;
  screenshots: string[];
  developerId: string;
  status: AppStatus;
  downloadCount: number;
  
  // THE FIX: Allow Timestamp OR a string representation for dates
  createdAt: Timestamp | string; 
  updatedAt?: Timestamp | string;
}
