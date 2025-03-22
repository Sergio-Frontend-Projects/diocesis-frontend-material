import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/users/`;

  getUsers() {
    return this.http.get<any[]>(this.api);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
