import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Parroquia } from '@core/models/parroquia.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParroquiaService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/parroquias`;

  getParroquiasPaginated(
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
      results: Parroquia[];
    }>(`${this.api}/?${params.toString()}`);
  }

   getParroquiaById(id: string) {
      return this.http.get<Parroquia>(`${this.api}/${id}/`);
    }

    createParroquia(data: FormData) {
      return this.http.post(`${this.api}/`, data);
    }

    activateParroquia(id: string) {
      return this.http.post(`${this.api}/habilitar/${id}/`, {});
    }

    updateParroquia(id: string, data: FormData) {
      return this.http.put(`${this.api}/${id}/`, data);
    }

    deleteParroquia(id: string) {
      return this.http.delete(`${this.api}/${id}/`);
    }
}
