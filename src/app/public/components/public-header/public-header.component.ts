import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule } from '@angular/router';
import { NavigationItem } from '@core/models/navigation.model';


@Component({
  selector: 'app-public-header',
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatExpansionModule,
    MatMenuModule
  ],
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.scss',
})
export class PublicHeaderComponent {
  isMobile = signal(false);
  sidenav = viewChild<MatSidenav>('sidenav');

  breakpointObserver = inject(BreakpointObserver);

  menuItems: NavigationItem[] = [
    { icon: 'home', label: 'Inicio', route: '/home' },
    {
      icon: 'apartment',
      label: 'Diócesis',
      children: [
        { icon: 'history', label: 'Historia', route: '/home' },
        { icon: 'person', label: 'Obispo', route: '/home' },
        { icon: 'event_note', label: 'Planeación Pastoral', route: '/home' },
        { icon: 'favorite', label: 'Obituario', route: '/home' },
      ],
    },
    {
      label: 'Gobierno',
      icon: 'gavel',
      children: [
        { icon: 'account_balance', label: 'Curia', route: '/home' },
        { icon: 'groups', label: 'Gobierno Pastoral', route: '/home' },
        { icon: 'event', label: 'Actividad Pastoral', route: '/home' },
      ],
    },
    {
      label: 'Directorio',
      icon: 'contacts',
      children: [
        { icon: 'person', label: 'Presbiteros', route: '/home' },
        { icon: 'location_on', label: 'Parroquias', route: '/home' },
        { icon: 'person_pin', label: 'Diáconos Permanentes', route: '/home' },
        { icon: 'person_pin_circle', label: 'Diáconos Transitorios', route: '/home' },
      ],
    },
    {
      label: 'Noticias',
      icon: 'campaign',
      children: [
        { icon: 'church', label: 'Diócesis', route: '/home' },
        { icon: 'school', label: 'Seminario', route: '/home' },
        { icon: 'public', label: 'Nacional', route: '/home' },
        { icon: 'language', label: 'Vaticano', route: '/home' },
      ],
    },
    { icon: 'school', label: 'Seminario', route: '/home' },
    {
      label: 'Archivo',
      icon: 'folder',
      children: [
        { icon: 'description', label: 'Documentos', route: '/home' },
        { icon: 'badge', label: 'Nombramientos', route: '/home' },
      ],
    },
    { icon: 'cloud_download', label: 'Descargas', route: '/home' },
    {
      label: 'Multimedia',
      icon: 'video_library',
      children: [{ icon: 'event_available', label: 'Misas', route: '/home' }],
    },
    { icon: 'volunteer_activism', label: 'Diezmo', route: '/home' },
  ];

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });
  }

  closeSidenav() {
    if (this.sidenav()?.opened) {
      this.sidenav()?.close();
    }
  }
}
