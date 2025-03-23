import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs';

interface Token {
  access: string;
  refresh: string;
}

export interface JwtPayload {
  user_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  login(username: string, password: string) {
    return this.http
      .post<Token>(`${environment.apiUrl}/token/login/`, {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.access);
          this.token.set(res.access);
        })
      );
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
