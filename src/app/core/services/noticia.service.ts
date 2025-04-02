import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Noticia } from '@core/models/noticia.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NoticiaService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/noticias`;

  getNoticiasPaginated(
    page: number,
    limit: number,
    filters: Record<string, any> = {}
  ) {
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      page_size: limit.toString(),
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });

    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Noticia[];
    }>(`${this.api}/?${params.toString()}`);
  }

  getNoticiaById(id: string) {
    return this.http.get<Noticia>(`${this.api}/${id}/`);
  }

  createNoticia(data: FormData) {
    return this.http.post(`${this.api}/`, data);
  }

  activateNoticia(id: string) {
    return this.http.post(`${this.api}/habilitar/${id}/`, {});
  }

  updateNoticia(id: string, data: FormData) {
    return this.http.put(`${this.api}/${id}/`, data);
  }

  deleteNoticia(id: string) {
    return this.http.delete(`${this.api}/${id}/`);
  }
}
