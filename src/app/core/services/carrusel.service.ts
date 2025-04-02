import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Carrusel } from '@core/models/carrusel.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarruselService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/carrusel`;

  getAll(): Observable<Carrusel[]> {
    return this.http.get<Carrusel[]>(`${this.api}/`);
  }

  create(formData: FormData): Observable<Carrusel> {
    return this.http.post<Carrusel>(`${this.api}/`, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}/`);
  }
}
