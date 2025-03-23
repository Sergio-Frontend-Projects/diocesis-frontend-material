export type FilterType = 'text' | 'select' | 'boolean' | 'date';

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: { label: string; value: any }[];
}
