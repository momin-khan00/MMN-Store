import { Timestamp } from 'firebase/firestore';

export type UserRole = "user" | "developer" | "moderator" | "admin";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  joinedAt: Timestamp;
}
