import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { UserRole } from '../../../core/models/user.model';
import { IconsService } from '../../../core/services/icons.service';
import { Auth } from '../../../public/login/services/auth';
import { RoleBadgeComponent } from '../../../shared/components/role-badge/role-badge';

type NavItem = {
  label: string;
  icon?: LucideIconData;
  to: string;
  requiredRole?: UserRole;
};

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
    RoleBadgeComponent,
  ],
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout implements OnInit {
  private router = inject(Router);
  protected readonly iconsService = inject(IconsService);
  protected authService = inject(Auth);

  private allItems: NavItem[] = [
    { label: 'Usuarios', to: '/dashboard/users', icon: this.iconsService.users },
    { label: 'Carrusel', to: '/dashboard/carousel', icon: this.iconsService.carousel },
    { label: 'Padres', to: '/dashboard/reverends', icon: this.iconsService.reverends },
    { label: 'Noticias', to: '/dashboard/news', icon: this.iconsService.newspaper },
    { label: 'Colonias', to: '/dashboard/colonies', icon: this.iconsService.map },
    { label: 'Decanatos', to: '/dashboard/decants', icon: this.iconsService.network },
    { label: 'Parroquias', to: '/dashboard/parishes', icon: this.iconsService.parish },
    { label: 'Artículos', to: '/dashboard/articles', icon: this.iconsService.articles },
    { label: 'Documentos', to: '/dashboard/documents', icon: this.iconsService.documents },
  ];

  open = signal(false);

  items = computed(() => {
    return this.allItems;
  });

  ngOnInit(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) return;
    this.authService.loadProfile(userId).subscribe();
  }

  toggle(): void {
    this.open.update((isOpen) => !isOpen);
  }

  closeOnNavigate(): void {
    if (window.innerWidth < 1024) {
      this.open.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
