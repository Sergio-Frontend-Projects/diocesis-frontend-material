import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Banner } from '@core/models/banner.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/carrusel`;

  getAll(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.api}/`);
  }

  create(formData: FormData): Observable<Banner> {
    return this.http.post<Banner>(`${this.api}/`, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}/`);
  }
}
