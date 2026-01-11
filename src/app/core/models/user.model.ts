export type UserRole = 'super' | 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  updatedBy?: User | null;
  deletedBy?: User | null;
}
