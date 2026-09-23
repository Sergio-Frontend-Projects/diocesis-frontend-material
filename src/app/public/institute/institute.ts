import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { combineLatest } from 'rxjs';
import { InstituteInformationService } from '../../admin/institute-information/services/institute-information';
import { InstituteCoursesService } from '../../admin/institute-courses/services/institute-courses';
import { InstituteTrainingsService } from '../../admin/institute-trainings/services/institute-trainings';
import { InstitutoInformacion } from '../../core/models/institute-information.model';
import { Capacitacion } from '../../core/models/institute-training.model';
import { CleanUrlPipe } from '../../core/pipes/clean-url.pipe';

const MODALITY_LABELS: Record<Capacitacion['modality'], string> = {
  presencial: 'Presencial',
  en_linea: 'En línea',
  mixta: 'Mixta',
};

/**
 * Página pública "Instituto Bíblico" (`/diocesis/instituto-biblico`, Tarea 3.1/4.1).
 * Información general, oferta de capacitación y cursos activos; FASE 5 añade sedes y
 * calendario a esta misma página.
 */
@Component({
  selector: 'app-institute',
  imports: [CommonModule, CleanUrlPipe],
  templateUrl: './institute.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Institute implements OnInit {
  private readonly informationService = inject(InstituteInformationService);
  protected readonly trainingsService = inject(InstituteTrainingsService);
  protected readonly coursesService = inject(InstituteCoursesService);

  readonly modalityLabels = MODALITY_LABELS;

  readonly information = signal<InstitutoInformacion | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    combineLatest([
      this.informationService.getInformation(),
      this.trainingsService.getCapacitacionesPaginated(0, 100, { isActive: true }),
      this.coursesService.getCursosPaginated(0, 100, { isActive: true }),
    ]).subscribe({
      next: ([info]) => {
        this.information.set(info);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
