import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FilterConfig } from '@core/models/filter-config.model';
import { Padre } from '@core/models/padre.model';
import { PadreService } from '@core/services/padre.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { FilterBarComponent } from '@shared/components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-padres',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    FilterBarComponent,
  ],
  templateUrl: './padres.component.html',
  styleUrl: './padres.component.scss',
})
export default class PadresComponent implements OnInit {
  private padreService = inject(PadreService);
  private toastrService = inject(ToastrService);
  private dialog = inject(MatDialog);

  padres = signal<Padre[]>([]);
  total = signal(0);
  page = signal(0);
  limit = signal(10);

  displayedColumns = [
    'isActive',
    'picture',
    'fullName',
    'birthDate',
    'actions',
  ];

  filters: FilterConfig[] = [
    { key: 'firstName', label: 'Nombre', type: 'text' },
    { key: 'lastName', label: 'Apellido', type: 'text' },
  ];

  ngOnInit(): void {
    this.loadPadres();
  }

  loadPadres(firstName: string | null = null, lastName: string | null = null) {
    this.padreService
      .getPadresPaginated(this.page(), this.limit(), firstName, lastName)
      .subscribe({
        next: (response) => {
          console.log(response.results);

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

  deletePadre(padre: Padre) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: padre.isActive ? 'Desactivar padre' : 'Activar padre',
        message:
          '¿Estás seguro de que deseas ' +
          (padre.isActive ? 'desactivar' : 'activar') +
          ' este padre?',
        buttonContent: padre.isActive ? 'Desactivar' : 'Activar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.padreService.deletePadre(padre.id).subscribe(() => {
        this.loadPadres();
      });
    });
  }

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.limit.set(event.pageSize);
    this.loadPadres();
  }

  onSearch(filtros: Record<string, any>) {
    const { firstName, lastName } = filtros;
    this.loadPadres(firstName, lastName);
  }
}
