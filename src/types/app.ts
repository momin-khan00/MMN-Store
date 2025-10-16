import { Timestamp } from 'firebase/firestore';

export type AppStatus = "pending" | "approved" | "rejected";

export interface App {
  // Fields for App Card
  id: string;
  name: string;
  category: string;
  developerName: string;
  iconUrl: string;
  rating?: number;
  
  // Fields for App Detail Page
  description: string;
  version: string;
  apkUrl: string;
  screenshots: string[];
  developerId: string;
  status: AppStatus;
  downloadCount: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp; // For app updates
}
