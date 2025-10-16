import { Timestamp } from 'firebase/firestore';

export type UserRole = "user" | "developer" | "moderator" | "admin";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string; // Optional URL for user's profile picture
  role: UserRole;
  joinedAt: Timestamp | Date;
}
