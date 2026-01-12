import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Colony } from '../../admin/colonies/services/colony';
import { Decant } from '../../admin/decants/services/decant';
import { Parish } from '../../admin/parishes/services/parish';
import { Reverends } from '../../admin/reverends/services/reverends';
import { Colonia } from '../../core/models/colony.model';
import { Decanato } from '../../core/models/decant.model';
import { Parroquia } from '../../core/models/parish.model';
import { Padre } from '../../core/models/reverend.model';
import { CleanUrlPipe } from '../../core/pipes/clean-url.pipe';
import { IconsService } from '../../core/services/icons.service';
import { forkJoin, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-parish-details',
  imports: [CommonModule, LucideAngularModule, CleanUrlPipe, RouterLink],
  templateUrl: './parish-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParishDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  protected readonly iconsService = inject(IconsService);

  isLoading = signal(false);

  protected readonly parishesService = inject(Parish);
  protected readonly decantService = inject(Decant);
  protected readonly colonyService = inject(Colony);
  protected readonly reverendsService = inject(Reverends);

  parish = signal<Parroquia | null>(null);
  decant = signal<Decanato | null>(null);
  colony = signal<Colonia | null>(null);
  reverend = signal<Padre | null>(null);
  currentUrl = signal<string>('');

  ngOnInit(): void {
    this.isLoading.set(true);

    const param = this.route.snapshot.paramMap.get('id');
    if (!param) {
      this.router.navigate(['/directorio/parroquias']);
      return;
    }

    const id = param.includes('-') ? ParishDetails.extractIdFromSlug(param) : param;
    this.currentUrl.set(window.location.href);

    this.parishesService
      .getParroquiaById(id)
      .pipe(
        tap((data) => {
          this.parish.set(data);
          this.title.setTitle(`${data.name} - Diócesis de Ciudad Obregón`);
          this.updateUrlWithSlug(data.name, id);
        }),
        switchMap((data) =>
          forkJoin({
            decanato: this.decantService.getDecanatoById(data.decanatoId),
            padre: this.reverendsService.getPadreById(data.padreId),
            colonia: this.colonyService.getColoniaById(data.coloniaId),
          }),
        ),
        tap(({ decanato, padre, colonia }) => {
          this.decant.set(decanato);
          this.reverend.set(padre);
          this.colony.set(colonia);
        }),
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false);
        },
      });
  }

  private updateUrlWithSlug(name: string, id: string): void {
    const slug = ParishDetails.generateSlug(name, id);
    const url = `/directorio/parroquias/${slug}`;
    window.history.replaceState({}, '', url);
    this.currentUrl.set(window.location.href);
  }

  public static generateSlug(name: string, id: string): string {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con guiones
      .replace(/^-+|-+$/g, '') // Eliminar guiones al inicio y final
      .substring(0, 60) // Limitar longitud del slug
      .replace(/-+$/g, ''); // Eliminar guiones al final después del substring
    return `${slug}-${id}`;
  }

  public static extractIdFromSlug(slug: string): string {
    const parts = slug.split('-');
    if (parts.length >= 5) {
      return parts.slice(-5).join('-');
    }
    return parts[parts.length - 1];
  }
}
