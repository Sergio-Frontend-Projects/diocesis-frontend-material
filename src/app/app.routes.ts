import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../app/public/pages/login/login.component'),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('../app/layout/admin-layout/admin-layout.component'),
    canActivate: [authGuard],
    children: [
      {
        path: 'users',
        loadComponent: () => import('../app/admin/pages/users/users.component'),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('../app/layout/public-layout/public-layout.component'),
    children: [],
  },
  { path: '**', redirectTo: '' },
];
