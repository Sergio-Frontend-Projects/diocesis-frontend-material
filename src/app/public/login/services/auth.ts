import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Token } from '../interfaces/token.interface';
import { User } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private token = signal<string | null>(localStorage.getItem('token'));
  private apiUrl = environment.apiUrl;

  user = signal<User | null>(null);

  login(username: string, password: string) {
    return this.http
      .post<Token>(`${this.apiUrl}/token/login/`, {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.access);
          this.token.set(res.access);
        }),
      );
  }

  loadProfile(id: string) {
    return this.http
      .get<User>(`${this.apiUrl}/users/usuarios/${id}/`)
      .pipe(tap((res) => this.user.set(res)));
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
  }

  getToken() {
    return this.token();
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.user_id;
    } catch {
      return null;
    }
  }
}
