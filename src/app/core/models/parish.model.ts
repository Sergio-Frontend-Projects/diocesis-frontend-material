export interface Parroquia {
  id: string;
  name: string;
  openingDate: string;
  address: string;
  zipCode: string;
  town: string;
  isActive: boolean;
  picture?: string | null;
  decanatoId: string;
  coloniaId: string;
  padreId: string;

  createdAt: string;
  createdBy: string;

  updatedAt: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}
