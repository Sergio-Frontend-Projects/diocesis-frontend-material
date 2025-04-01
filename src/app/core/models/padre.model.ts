export interface Padre {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  picture?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}
