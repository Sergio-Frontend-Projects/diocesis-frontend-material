import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Colonia } from '@core/models/colonia.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ColoniaService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/colonias`;

  getColoniasPaginated(
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
      results: Colonia[];
    }>(`${this.api}/?${params.toString()}`);
  }

  getColoniaById(id: string) {
    return this.http.get<Colonia>(`${this.api}/${id}/`);
  }

  createColonia(data: Partial<Colonia>) {
    return this.http.post(`${this.api}/`, data);
  }

  activateColinia(id: string) {
    return this.http.post(`${this.api}/habilitar/${id}/`, {});
  }

  updateColonia(id: string, data: Partial<Colonia>) {
    return this.http.put(`${this.api}/${id}/`, data);
  }

  deleteColonia(id: string) {
    return this.http.delete(`${this.api}/${id}/`);
  }
}
