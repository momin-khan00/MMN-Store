export type UserRole = 'user' | 'developer' | 'moderator' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  joinedAt: Date;
}
