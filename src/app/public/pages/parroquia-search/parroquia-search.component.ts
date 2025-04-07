import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { FilterConfig } from '@core/models/filter-config.model';
import { Parroquia } from '@core/models/parroquia.model';
import { ParroquiaService } from '@core/services/parroquia.service';
import { ToastrService } from '@core/services/toastr.service';
import { FilterBarComponent } from '@shared/components/filter-bar/filter-bar.component';
import { ParroquiaCardComponent } from '@public/components/parroquia-card/parroquia-card.component';

@Component({
  selector: 'app-parroquia-search',
  imports: [
    CommonModule,
    FilterBarComponent,
    MatPaginatorModule,
    RouterModule,
    ParroquiaCardComponent,
  ],
  templateUrl: './parroquia-search.component.html',
  styleUrl: './parroquia-search.component.scss',
})
export default class ParroquiaSearchComponent {
  private parroquiaService = inject(ParroquiaService);
  private toastrService = inject(ToastrService);

  parroquias = signal<Parroquia[]>([]);
  recordedFilters = signal<Record<string, any>>({});
  total = signal(0);
  page = signal(0);
  limit = signal(10);

  filters: FilterConfig[] = [{ key: 'name', label: 'Nombre', type: 'text' }];

  loadParroquias() {
    this.parroquiaService
      .getParroquiasPaginated(this.page(), this.limit(), this.recordedFilters())
      .subscribe({
        next: (response) => {
          this.parroquias.set(response.results);
          this.total.set(response.count);
        },
        error: () => {
          this.toastrService.showError(
            'Error al obtener parroquias.',
            'Malas noticias'
          );
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.limit.set(event.pageSize);
    this.loadParroquias();
  }

  onSearch(filtros: Record<string, any>) {
    this.recordedFilters.set(filtros);
    this.loadParroquias();
  }

  onClear() {
    this.recordedFilters.set({});
    this.total.set(0);
    this.page.set(0);
    this.parroquias.set([]);
  }
}
