import { DocumentType } from '../../core/models/document.model';
import { InstituteModality } from '../../core/models/institute-training.model';
import { AppModuleName, UserRole } from '../../core/models/user.model';

export type Mode = 'create' | 'edit' | null;

export interface UserCreateForm {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  moduleAccess: AppModuleName[];
}

export interface UserEditForm {
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  moduleAccess: AppModuleName[];
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

export interface TrainingForm {
  name: string;
  description: string;
  modality: InstituteModality;
}

export interface CourseForm {
  title: string;
  description: string;
  modality: InstituteModality;
  capacitacionId: string;
  startDate: string;
  endDate: string;
  meetingLink: string;
}
