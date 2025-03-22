import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { LoginComponent } from './public/pages/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [],
  },
  { path: '', component: PublicLayoutComponent, children: [] },
  { path: '**', redirectTo: '' },
];
