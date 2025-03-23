import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

interface Options {
  routerLink: string;
  text: string;
}

@Component({
  selector: 'app-admin-layout',
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminLayoutComponent implements OnInit {
  auth = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);

  breakpointObserver = inject(BreakpointObserver);

  isSmallScreen = signal(false);
  sidenavOpened = signal(true);
  user = signal<User | null>(null);

  menuOptions: Options[] = [
    { routerLink: '/admin/users', text: 'Usuarios' },
    { routerLink: '/admin/users', text: 'Banners y vídeos' },
    { routerLink: '/admin/users', text: 'Padres' },
    { routerLink: '/admin/users', text: 'Decanatos' },
    { routerLink: '/admin/users', text: 'Colonias' },
    { routerLink: '/admin/users', text: 'Parroquias' },
    { routerLink: '/admin/users', text: 'Noticias' },
    { routerLink: '/admin/users', text: 'Artículos' },
    { routerLink: '/admin/users', text: 'Documentos' },
  ];

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

  ngOnInit(): void {
    const userId = this.auth.getUserIdFromToken();

    if (!userId) return;

    this.userService.getUserById(userId).subscribe((u) => {
      this.user.set(u);
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
