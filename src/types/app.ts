import { Timestamp } from 'firebase/firestore';

export type AppStatus = "pending" | "approved" | "rejected";

export interface App {
  id: string;
  name: string;
  category: string;
  developerName: string; // Added for display on card
  iconUrl: string;
  rating?: number; // Optional
  // Full details will be added later
}
