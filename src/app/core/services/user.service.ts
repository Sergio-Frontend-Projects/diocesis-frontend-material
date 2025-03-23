import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/users/`;

  getUsersPaginated(page: number, limit: number) {
    return this.http.get<{ data: User[]; total: number }>(
      `${this.api}?page=${page + 1}&page_size=${limit}`
    );
  }

  getUserById(id: string) {
    return this.http.get<User>(`${this.api}/${id}`);
  }

  createUser(data: Partial<User>) {
    return this.http.post<User>(this.api, data);
  }

  createUsersByCsv(formData: FormData) {
    return this.http.post<any>(this.api, formData);
  }

  updateUser(id: string, data: Partial<User>) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
