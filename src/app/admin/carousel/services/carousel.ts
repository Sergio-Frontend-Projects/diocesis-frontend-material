import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Carrusel } from '../../../core/models/carousel.model';

@Injectable({
  providedIn: 'root',
})
export class Carousel {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/carrusel`;

  getAll(): Observable<Carrusel[]> {
    return this.http.get<Carrusel[]>(`${this.apiUrl}/`);
  }

  create(formData: FormData): Observable<Carrusel> {
    return this.http.post<Carrusel>(`${this.apiUrl}/`, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}
