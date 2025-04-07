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
      {
        path: 'carrusel',
        loadComponent: () =>
          import('./admin/pages/carrusel/carrusel.component'),
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
      {
        path: 'colonias',
        loadComponent: () =>
          import('../app/admin/pages/colonias/colonias.component'),
      },
      {
        path: 'colonias/add',
        loadComponent: () =>
          import('../app/admin/pages/colonia-form/colonia-form.component'),
      },
      {
        path: 'colonias/edit/:id',
        loadComponent: () =>
          import('../app/admin/pages/colonia-form/colonia-form.component'),
      },
      {
        path: 'decanatos',
        loadComponent: () =>
          import('../app/admin/pages/decanatos/decanatos.component'),
      },
      {
        path: 'decanatos/add',
        loadComponent: () =>
          import('../app/admin/pages/decanato-form/decanato-form.component'),
      },
      {
        path: 'decanatos/edit/:id',
        loadComponent: () =>
          import('../app/admin/pages/decanato-form/decanato-form.component'),
      },
      {
        path: 'parroquias',
        loadComponent: () =>
          import('../app/admin/pages/parroquias/parroquias.component'),
      },
      {
        path: 'parroquias/add',
        loadComponent: () =>
          import('../app/admin/pages/parroquia-form/parroquia-form.component'),
      },
      {
        path: 'parroquias/edit/:id',
        loadComponent: () =>
          import('../app/admin/pages/parroquia-form/parroquia-form.component'),
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
        path: 'noticia/:id',
        loadComponent: () =>
          import(
            '../app/public/pages/noticia-detalle/noticia-detalle.component'
          ),
      },
      {
        path: 'padres',
        loadComponent: () =>
          import('../app/public/pages/padre-search/padre-search.component'),
      },
      {
        path: 'padres/:id',
        loadComponent: () =>
          import('../app/public/pages/padre-detalle/padre-detalle.component'),
      },
      {
        path: 'parroquias',
        loadComponent: () =>
          import('../app/public/pages/parroquia-search/parroquia-search.component'),
      },
      {
        path: 'parroquias/:id',
        loadComponent: () =>
          import('../app/public/pages/parroquia-detalle/parroquia-detalle.component'),
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
