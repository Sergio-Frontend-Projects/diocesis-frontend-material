import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FilterConfig } from '@core/models/filter-config.model';
import { Noticia } from '@core/models/noticia.model';
import { CleanUrlPipe } from '@core/pipes/clean-url.pipe';
import { NoticiaService } from '@core/services/noticia.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { FilterBarComponent } from '@shared/components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-noticias',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    FilterBarComponent,
    CleanUrlPipe,
  ],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.scss',
})
export default class NoticiasComponent implements OnInit {
  private noticiaService = inject(NoticiaService);
  private toastrService = inject(ToastrService);

  private dialog = inject(MatDialog);

  noticias = signal<Noticia[]>([]);
  recordedFilters = signal<Record<string, any>>({});
  total = signal(0);
  page = signal(0);
  limit = signal(10);

  displayedColumns = ['isActive', 'picture', 'title', 'tags', 'actions'];

  filters: FilterConfig[] = [
    { key: 'title', label: 'Título', type: 'text' },
    { key: 'tags', label: 'Tags', type: 'text' },
  ];

  ngOnInit(): void {
    this.loadNoticias();
  }

  loadNoticias() {
    this.noticiaService
      .getNoticiasPaginated(this.page(), this.limit(), this.recordedFilters())
      .subscribe({
        next: (res) => {
          this.noticias.set(res.results);
          this.total.set(res.count);
        },
        error: () => {
          this.toastrService.showError(
            'Error al cargar noticias',
            'Malas noticias'
          );
        },
      });
  }

  deleteNoticia(noticia: Noticia) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: noticia.isActive ? 'Desactivar noticia' : 'Activar noticia',
        message:
          '¿Estás seguro de que deseas ' +
          (noticia.isActive ? 'desactivar' : 'activar') +
          ' esta noticia?',
        buttonContent: noticia.isActive ? 'Desactivar' : 'Activar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const action = noticia.isActive
        ? this.noticiaService.deleteNoticia(noticia.id)
        : this.noticiaService.activateNoticia(noticia.id);

      action.subscribe(() => {
        this.loadNoticias();
      });
    });
  }

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.limit.set(event.pageSize);
    this.loadNoticias();
  }

  onSearch(filtros: Record<string, any>) {
    this.recordedFilters.set(filtros);
    this.loadNoticias();
  }
}
