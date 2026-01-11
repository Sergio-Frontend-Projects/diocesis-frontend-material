import { DocumentType } from '../../core/models/document.model';
import { UserRole } from '../../core/models/user.model';

export type Mode = 'create' | 'edit' | null;

export interface UserCreateForm {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserEditForm {
  username: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface ReverendForm {
  firstName: string;
  lastName: string;
  birthDate: string;
  email?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

export interface NewspaperForm {
  title: string;
  content: string;
  tags: string;
}

export interface DecantForm {
  name: string;
}
export interface ColonieForm {
  name: string;
}

export interface ParishForm {
  name: string;
  openingDate: string;
  address: string;
  zipCode: string;
  town: string;
  coloniaId: string;
  decanatoId: string;
  padreId: string;
}

export interface ArticleForm {
  title: string;
  content: string;
  tags: string;
}

export interface DocumentForm {
  title: string;
  tags: string;
  type: DocumentType;
}
