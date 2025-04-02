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
      {
        path: 'users/add',
        loadComponent: () =>
          import('../app/admin/pages/user-form/user-form.component'),
      },
      {
        path: 'users/edit/:id',
        loadComponent: () =>
          import('../app/admin/pages/user-form/user-form.component'),
      },
      {
        path: 'padres',
        loadComponent: () =>
          import('../app/admin/pages/padres/padres.component'),
      },
      {
        path: 'padres/add',
        loadComponent: () =>
          import('../app/admin/pages/padre-form/padre-form.component'),
      },
      {
        path: 'padres/edit/:id',
        loadComponent: () =>
          import('../app/admin/pages/padre-form/padre-form.component'),
      },
      // ! CAMBIAR POR CARRUSEL
      {
        path: 'banners',
        loadComponent: () =>
          import('../app/admin/pages/banners/banners.component'),
      },
      {
        path: 'noticias',
        loadComponent: () =>
          import('../app/admin/pages/noticias/noticias.component'),
      },
      {
        path: 'noticias/add',
        loadComponent: () =>
          import('../app/admin/pages/noticia-form/noticia-form.component'),
      },
      {
        path: 'noticias/edit/:id',
        loadComponent: () =>
          import('../app/admin/pages/noticia-form/noticia-form.component'),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('../app/layout/public-layout/public-layout.component'),
    children: [
      {
        path: 'home',
        loadComponent: () => import('../app/public/pages/home/home.component'),
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
