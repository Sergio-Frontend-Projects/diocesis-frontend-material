import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Padre } from '@core/models/padre.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PadreService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/padres`;

  getPadresPaginated(
    page: number,
    limit: number,
    firstName: string | null,
    lastName: string | null
  ) {
    let url = `${this.api}/?page=${page + 1}&page_size=${limit}`;

    if (firstName !== null) url += `&first_name=${firstName}`;
    if (lastName !== null) url += `&last_name=${lastName}`;

    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Padre[];
    }>(url);
  }

  getPadreById(id: string) {
    return this.http.get<Padre>(`${this.api}/${id}/`);
  }

  createPadre(data: FormData) {
    return this.http.post(`${this.api}/`, data);
  }

  activatePadre(id: string) {
    return this.http.post(`${this.api}/habilitar/${id}/`, {});
  }

  updatePadre(id: string, data: FormData) {
    return this.http.put(`${this.api}/${id}/`, data);
  }

  deletePadre(id: string) {
    return this.http.delete(`${this.api}/${id}/`);
  }
}
