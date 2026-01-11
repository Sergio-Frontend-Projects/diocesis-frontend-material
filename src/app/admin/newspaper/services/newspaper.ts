import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Noticia } from '../../../core/models/newspaper.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Newspaper {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/noticias`;

  readonly news = signal<Noticia[]>([]);
  readonly totalNews = signal<number>(0);

  getNoticiasPaginated(page: number, limit: number, filters: Record<string, any> = {}) {
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
        results: Noticia[];
      }>(`${this.apiUrl}/?${params.toString()}`)
      .pipe(
        tap((res) => {
          this.news.set(Array.isArray(res.results) ? res.results : []);
          this.totalNews.set(res.count);
        }),
      );
  }

  getNoticiaById(id: string) {
    return this.http.get<Noticia>(`${this.apiUrl}/${id}/`);
  }

  createNoticia(data: FormData) {
    return this.http.post(`${this.apiUrl}/`, data);
  }

  activateNoticia(id: string) {
    return this.http.post(`${this.apiUrl}/habilitar/${id}/`, {});
  }

  updateNoticia(id: string, data: FormData) {
    return this.http.put(`${this.apiUrl}/${id}/`, data);
  }

  deleteNoticia(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}/`);
  }
}
