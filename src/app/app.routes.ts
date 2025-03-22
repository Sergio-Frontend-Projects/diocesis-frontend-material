import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';

export const routes: Routes = [
  { path: 'admin', component: AdminLayoutComponent, children: [] },
  { path: '', component: PublicLayoutComponent, children: [] },
  { path: '**', redirectTo: '' },
];
