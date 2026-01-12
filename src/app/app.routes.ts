import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ReverendDetails } from './public/reverend-details/reverend-details';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./public/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/admin/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: 'users',
        loadComponent: () => import('./admin/users/users').then((m) => m.UsersComponent),
      },
      {
        path: 'carousel',
        loadComponent: () => import('./admin/carousel/carousel').then((m) => m.CarouselComponent),
      },
      {
        path: 'reverends',
        loadComponent: () =>
          import('./admin/reverends/reverends').then((m) => m.ReverendsComponent),
      },
      {
        path: 'news',
        loadComponent: () =>
          import('./admin/newspaper/newspaper').then((m) => m.NewspaperComponent),
      },
      {
        path: 'colonies',
        loadComponent: () => import('./admin/colonies/colonies').then((m) => m.ColoniesComponent),
      },
      {
        path: 'decants',
        loadComponent: () => import('./admin/decants/decants').then((m) => m.DecantsComponent),
      },
      {
        path: 'parishes',
        loadComponent: () => import('./admin/parishes/parishes').then((m) => m.ParishesComponent),
      },
      {
        path: 'articles',
        loadComponent: () => import('./admin/articles/articles').then((m) => m.ArticlesComponent),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./admin/documents/documents').then((m) => m.DocumentsComponent),
      },
      {
        path: '**',
        redirectTo: 'users',
      },
    ],
  },
  {
    path: '',
    loadComponent: () => import('./layouts/public/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./public/home/home').then((m) => m.Home),
      },
      {
        path: 'noticia/:id',
        loadComponent: () =>
          import('./public/post-details/post-details').then((m) => m.PostDetails),
      },
      {
        path: 'directorio/padres',
        loadComponent: () =>
          import('./public/reverend-search/reverend-search').then((m) => m.ReverendSearch),
      },
      {
        path: 'directorio/padres/:id',
        loadComponent: () =>
          import('./public/reverend-details/reverend-details').then((m) => m.ReverendDetails),
      },
      {
        path: 'directorio/parroquias',
        loadComponent: () =>
          import('./public/parish-search/parish-search').then((m) => m.ParishSearch),
      },
      {
        path: 'directorio/parroquias/:id',
        loadComponent: () =>
          import('./public/parish-details/parish-details').then((m) => m.ParishDetails),
      },
      {
        path: 'noticias',
        loadComponent: () => import('./public/post-search/post-search').then((m) => m.PostSearch),
      },
      {
        path: 'noticias/:tag',
        loadComponent: () => import('./public/post-search/post-search').then((m) => m.PostSearch),
      },
      {
        path: '**',
        redirectTo: 'inicio',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
