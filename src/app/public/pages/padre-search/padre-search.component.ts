import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FilterConfig } from '@core/models/filter-config.model';
import { Padre } from '@core/models/padre.model';
import { CleanUrlPipe } from '@core/pipes/clean-url.pipe';
import { PadreService } from '@core/services/padre.service';
import { ToastrService } from '@core/services/toastr.service';
import { FilterBarComponent } from '@shared/components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-padre-search',
  imports: [CleanUrlPipe, CommonModule, FilterBarComponent, MatPaginatorModule],
  templateUrl: './padre-search.component.html',
  styleUrl: './padre-search.component.scss',
})
export default class PadreSearchComponent {
  private padreService = inject(PadreService);
  private toastrService = inject(ToastrService);

  padres = signal<Padre[]>([]);
  recordedFilters = signal<Record<string, any>>({});
  total = signal(0);
  page = signal(0);
  limit = signal(10);

  filters: FilterConfig[] = [
    { key: 'first_name', label: 'Nombre', type: 'text' },
    { key: 'last_name', label: 'Apellido', type: 'text' },
  ];

  loadPadres() {
    this.padreService
      .getPadresPaginated(this.page(), this.limit(), this.recordedFilters())
      .subscribe({
        next: (response) => {
          this.padres.set(response.results);
          this.total.set(response.count);
        },
        error: () => {
          this.toastrService.showError(
            'Error al obtener padres.',
            'Malas noticias'
          );
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.limit.set(event.pageSize);
    this.loadPadres();
  }

  onSearch(filtros: Record<string, any>) {
    this.recordedFilters.set(filtros);
    this.loadPadres();
  }

  onClear() {
    this.recordedFilters.set({});
    this.total.set(0);
    this.page.set(0);
    this.padres.set([]);
  }
}
