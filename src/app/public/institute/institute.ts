import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { InstitutoInformacion } from '../../core/models/institute-information.model';
import { InstituteInformationService } from '../../admin/institute-information/services/institute-information';

/**
 * Página pública "Instituto Bíblico" (`/diocesis/instituto-biblico`, Tarea 3.1). Por
 * ahora solo la sección de información general; FASE 4/5 añaden capacitaciones,
 * cursos, sedes y calendario a esta misma página.
 */
@Component({
  selector: 'app-institute',
  imports: [CommonModule],
  templateUrl: './institute.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Institute implements OnInit {
  private readonly informationService = inject(InstituteInformationService);

  readonly information = signal<InstitutoInformacion | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.informationService.getInformation().subscribe({
      next: (info) => {
        this.information.set(info);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
