import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ParroquiaService } from '@core/services/parroquia.service';
import { ToastrService } from '@core/services/toastr.service';
import { Parroquia } from '@core/models/parroquia.model';
import { FilterConfig } from '@core/models/filter-config.model';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FilterBarComponent } from '../../../shared/components/filter-bar/filter-bar.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-parroquias',
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    FilterBarComponent,
  ],
  templateUrl: './parroquias.component.html',
  styleUrl: './parroquias.component.scss',
})
export default class ParroquiasComponent implements OnInit {
  parroquiaService = inject(ParroquiaService);
  toastrService = inject(ToastrService);
  dialog = inject(MatDialog);

  parroquias = signal<Parroquia[]>([]);
  recordedFilters = signal<Record<string, any>>({});
  total = signal(0);
  page = signal(0);
  limit = signal(10);

  filters: FilterConfig[] = [
    { key: 'name', label: 'Nombre', type: 'text' },
    { key: 'town', label: 'Ciudad', type: 'text' },
  ];

  displayedColumns = ['isActive', 'name', 'town', 'actions'];

  ngOnInit(): void {
    this.loadParroquias();
  }

  loadParroquias() {
    this.parroquiaService
      .getParroquiasPaginated(this.page(), this.limit())
      .subscribe({
        next: (res) => {
          this.parroquias.set(res.results);
          this.total.set(res.count);
        },
        error: () =>
          this.toastrService.showError(
            'Error al obtener las parroquias',
            'Malas noticias'
          ),
      });
  }

  deleteParroquia(parroquia: Parroquia) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: parroquia.isActive
          ? 'Desactivar parroquia'
          : 'Activar parroquia',
        message:
          '¿Estás seguro de que deseas ' +
          (parroquia.isActive ? 'desactivar' : 'activar') +
          ' esta parroquia?',
        buttonContent: parroquia.isActive ? 'Desactivar' : 'Activar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const action = parroquia.isActive
        ? this.parroquiaService.deleteParroquia(parroquia.id)
        : this.parroquiaService.activateParroquia(parroquia.id);

      action.subscribe(() => {
        this.loadParroquias();
      });
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
}
