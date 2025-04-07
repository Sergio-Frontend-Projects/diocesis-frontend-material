import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Decanato } from '@core/models/decanato.model';
import { FilterConfig } from '@core/models/filter-config.model';
import { DecanatoService } from '@core/services/decanato.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { FilterBarComponent } from '@shared/components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-decanatos',
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    FilterBarComponent,
  ],
  templateUrl: './decanatos.component.html',
  styleUrl: './decanatos.component.scss',
})
export default class DecanatosComponent implements OnInit {
  decanatoService = inject(DecanatoService);
  toastrService = inject(ToastrService);
  dialog = inject(MatDialog);

  decanatos = signal<Decanato[]>([]);
  recordedFilters = signal<Record<string, any>>({});
  total = signal(0);
  page = signal(0);
  limit = signal(10);

  displayedColumns = ['isActive', 'name', 'actions'];

  filters: FilterConfig[] = [{ key: 'name', label: 'Nombre', type: 'text' }];

  ngOnInit(): void {
    this.laodDecanatos();
  }

  laodDecanatos() {
    this.decanatoService
      .getDecanatosPaginated(this.page(), this.limit(), this.recordedFilters())
      .subscribe({
        next: (res) => {
          this.decanatos.set(res.results);
          this.total.set(res.count);

          console.log(res.results);
        },
        error: () => {
          this.toastrService.showError(
            'Error al obtener decanatos',
            'Malas noticias'
          );
        },
      });
  }

  deleteColonia(decanato: Decanato) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: decanato.isActive ? 'Desactivar colonia' : 'Activar colonia',
        message:
          '¿Estás seguro de que deseas ' +
          (decanato.isActive ? 'desactivar' : 'activar') +
          ' esta colonia?',
        buttonContent: decanato.isActive ? 'Desactivar' : 'Activar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const action = decanato.isActive
        ? this.decanatoService.deleteDecanato(decanato.id)
        : this.decanatoService.activateDecanato(decanato.id);

      action.subscribe(() => {
        this.laodDecanatos();
      });
    });
  }

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.limit.set(event.pageSize);
    this.laodDecanatos();
  }

  onSearch(filtros: Record<string, any>) {
    this.recordedFilters.set(filtros);
    this.laodDecanatos();
  }
}
