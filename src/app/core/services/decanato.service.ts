import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Decanato } from '@core/models/decanato.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DecanatoService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/decanatos`;


  getDecanatosPaginated(
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
        results: Decanato[];
      }>(`${this.api}/?${params.toString()}`);
    }

    getDecanatoById(id: string) {
      return this.http.get<Decanato>(`${this.api}/${id}/`);
    }

    createDecanato(data: Partial<Decanato>) {
      return this.http.post(`${this.api}/`, data);
    }

    activateDecanato(id: string) {
      return this.http.post(`${this.api}/habilitar/${id}/`, {});
    }

    updateDecanato(id: string, data: Partial<Decanato>) {
      return this.http.put(`${this.api}/${id}/`, data);
    }

    deleteDecanato(id: string) {
      return this.http.delete(`${this.api}/${id}/`);
    }
}
