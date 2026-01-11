export interface Padre {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  isActive: boolean;
  picture?: string | null;
  email?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}
