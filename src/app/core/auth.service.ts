import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  login(username: string, password: string) {
    return this.http.post<{ token: string }>('', { username, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        this.token.set(res.token);
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
}
