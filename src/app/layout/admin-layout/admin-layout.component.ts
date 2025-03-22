import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth.service';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-admin-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  router = inject(Router);

  breakpointObserver = inject(BreakpointObserver);

  isSmallScreen = signal(false);
  sidenavOpened = signal(true);

  constructor() {
    effect(() => {
      this.breakpointObserver
        .observe([Breakpoints.Handset])
        .subscribe((result) => {
          const isSmall = result.matches;
          this.isSmallScreen.set(isSmall);
          this.sidenavOpened.set(!isSmall);
        });
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  toggleSidenav() {
    this.sidenavOpened.update((open) => !open);
  }
}
