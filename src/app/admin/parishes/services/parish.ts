import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Parroquia } from '../../../core/models/parish.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Parish {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/parroquias`;

  readonly parishes = signal<Parroquia[]>([]);
  readonly totalParishes = signal<number>(0);

  getParroquiasPaginated(page: number, limit: number, filters: Record<string, any> = {}) {
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
        results: Parroquia[];
      }>(`${this.apiUrl}/?${params.toString()}`)
      .pipe(
        tap((res) => {
          this.parishes.set(Array.isArray(res.results) ? res.results : []);
          this.totalParishes.set(res.count);
        }),
      );
  }

  getParroquiaById(id: string) {
    return this.http.get<Parroquia>(`${this.apiUrl}/${id}/`);
  }

  createParroquia(data: FormData) {
    return this.http.post(`${this.apiUrl}/`, data);
  }

  activateParroquia(id: string) {
    return this.http.post(`${this.apiUrl}/habilitar/${id}/`, {});
  }

  updateParroquia(id: string, data: FormData) {
    return this.http.put(`${this.apiUrl}/${id}/`, data);
  }

  deleteParroquia(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}/`);
  }
}
