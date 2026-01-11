import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Documento } from '../../../core/models/document.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Document {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/documentos`;

  readonly documents = signal<Documento[]>([]);
  readonly totalDocuments = signal<number>(0);

  getDocumentosPaginated(page: number, limit: number, filters: Record<string, any> = {}) {
    const params = new URLSearchParams({
      page: (page / limit + 1).toString(),
      page_size: limit.toString(),
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });

    return this.http
      .get<{
        count: number;
        next: string | null;
        previous: string | null;
        results: Documento[];
      }>(`${this.apiUrl}/?${params.toString()}`)
      .pipe(
        tap((res) => {
          this.documents.set(Array.isArray(res.results) ? res.results : []);
          this.totalDocuments.set(res.count);
        }),
      );
  }

  getDocumentoById(id: string) {
    return this.http.get<Documento>(`${this.apiUrl}/${id}/`);
  }

  createDocumento(data: FormData) {
    return this.http.post(`${this.apiUrl}/`, data);
  }

  activateDocumento(id: string) {
    return this.http.post(`${this.apiUrl}/habilitar/${id}/`, {});
  }

  updateDocumento(id: string, data: FormData) {
    return this.http.put(`${this.apiUrl}/${id}/`, data);
  }

  deleteDocumento(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}/`);
  }
}
