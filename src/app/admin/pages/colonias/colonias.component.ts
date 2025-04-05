import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Colonia } from '@core/models/colonia.model';
import { FilterConfig } from '@core/models/filter-config.model';
import { ColoniaService } from '@core/services/colonia.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { FilterBarComponent } from '@shared/components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-colonias',
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    FilterBarComponent,
  ],
  templateUrl: './colonias.component.html',
  styleUrl: './colonias.component.scss',
})
export default class ColoniasComponent implements OnInit {
  coloniaService = inject(ColoniaService);
  toastrService = inject(ToastrService);
  dialog = inject(MatDialog);

  colonias = signal<Colonia[]>([]);
  recordedFilters = signal<Record<string, any>>({});
  total = signal(0);
  page = signal(0);
  limit = signal(10);

  displayedColumns = ['isActive', 'name', 'actions'];

  filters: FilterConfig[] = [{ key: 'name', label: 'Nombre', type: 'text' }];

  ngOnInit(): void {
    this.loadColonias();
  }

  loadColonias() {
    this.coloniaService
      .getColoniasPaginated(this.page(), this.limit(), this.recordedFilters())
      .subscribe({
        next: (res) => {
          this.colonias.set(res.results);
          this.total.set(res.count);

          console.log(res.results);
        },
        error: () => {
          this.toastrService.showError(
            'Error al obtener colonias',
            'Malas noticias'
          );
        },
      });
  }

  deleteColonia(colonia: Colonia) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: colonia.isActive ? 'Desactivar colonia' : 'Activar colonia',
        message:
          '¿Estás seguro de que deseas ' +
          (colonia.isActive ? 'desactivar' : 'activar') +
          ' esta colonia?',
        buttonContent: colonia.isActive ? 'Desactivar' : 'Activar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const action = colonia.isActive
        ? this.coloniaService.deleteColonia(colonia.id)
        : this.coloniaService.activateColinia(colonia.id);

      action.subscribe(() => {
        this.loadColonias();
      });
    });
  }

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.limit.set(event.pageSize);
    this.loadColonias();
  }

  onSearch(filtros: Record<string, any>) {
    this.recordedFilters.set(filtros);
    this.loadColonias();
  }
}
