import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Articulo } from '../../../core/models/article.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Article {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/articulos`;

  readonly articles = signal<Articulo[]>([]);
  readonly totalArticles = signal<number>(0);

  getArticulosPaginated(page: number, limit: number, filters: Record<string, any> = {}) {
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
        results: Articulo[];
      }>(`${this.apiUrl}/?${params.toString()}`)
      .pipe(
        tap((res) => {
          this.articles.set(Array.isArray(res.results) ? res.results : []);
          this.totalArticles.set(res.count);
        }),
      );
  }

  getArticuloById(id: string) {
    return this.http.get<Articulo>(`${this.apiUrl}/${id}/`);
  }

  createArticulo(data: Partial<Articulo>) {
    return this.http.post(`${this.apiUrl}/`, data);
  }

  activateArticulo(id: string) {
    return this.http.post(`${this.apiUrl}/habilitar/${id}/`, {});
  }

  updateArticulo(id: string, data: Partial<Articulo>) {
    return this.http.put(`${this.apiUrl}/${id}/`, data);
  }

  deleteArticulo(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}/`);
  }
}
