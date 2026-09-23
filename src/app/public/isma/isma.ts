import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { IsmaInformationService } from '../../admin/isma-information/services/isma-information';
import { IsmaInformacion } from '../../core/models/isma-information.model';

/**
 * Página pública "ISMA" (`/diocesis/isma`, Tarea 6.1). Información general organizada
 * por secciones (introducción, documentación, parroquia correspondiente, entrevista,
 * programa, tiempos de anticipación, contacto); FASE 7 añade casos especiales y
 * preguntas frecuentes a esta misma página.
 */
@Component({
  selector: 'app-isma',
  imports: [CommonModule],
  templateUrl: './isma.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Isma implements OnInit {
  private readonly informationService = inject(IsmaInformationService);

  readonly information = signal<IsmaInformacion | null>(null);
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
