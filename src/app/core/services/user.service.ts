import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/users`;

  getUsersPaginated(
    page: number,
    limit: number,
    username: string | null,
    estado: boolean | null
  ) {
    let url = `${this.api}/usuarios/?page=${page + 1}&page_size=${limit}`;

    if (username !== null) url += `&username=${username}`;
    if (estado !== null) url += `&isActive=${estado}`;

    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: User[];
    }>(url);
  }

  getUserById(id: string) {
    return this.http.get<User>(`${this.api}/usuarios/${id}/`);
  }

  createUser(data: Partial<User>) {
    return this.http.post<User>(`${this.api}/usuarios/`, data);
  }

  createUsersByCsv(formData: FormData) {
    return this.http.post<any>(`${this.api}/usuarios/cargar-por-csv/`, formData);
  }

  updateUser(id: string, data: Partial<User>) {
    return this.http.put(`${this.api}/usuarios/${id}/`, data);
  }

  deleteUser(id: string) {
    return this.http.put(`${this.api}/usuarios/cambiar-estado/${id}/`, {});
  }
}
