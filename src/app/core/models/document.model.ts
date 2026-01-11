export type DocumentType =
  | 'carta'
  | 'circular'
  | 'comunicado'
  | 'prensa'
  | 'decreto'
  | 'instruccion'
  | 'mensaje'
  | 'dominical'
  | 'rescripto';

export interface Documento {
  id: string;
  title: string;
  document: string;
  tags: string[];
  type: DocumentType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}
