import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.warn('Token inválido o expirado. Cerrando sesión...');
        auth.logout();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
