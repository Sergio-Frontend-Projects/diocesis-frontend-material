import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FilterConfig } from '@core/models/filter-config.model';
import { User } from '@core/models/user.model';
import { ToastrService } from '@core/services/toastr.service';
import { UserService } from '@core/services/user.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { FilterBarComponent } from '@shared/components/filter-bar/filter-bar.component';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    PaginatorComponent,
    FilterBarComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export default class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private toastrService = inject(ToastrService);
  private dialog = inject(MatDialog);

  users = signal<User[]>([]);
  total = signal(0);
  page = signal(0);
  limit = signal(10);

  displayedColumns = ['isActive', 'username', 'email', 'actions'];

  filters: FilterConfig[] = [
    { key: 'username', label: 'Nombre', type: 'text' },
    {
      key: 'isActive',
      label: 'Estado',
      type: 'boolean',
      options: [
        { label: 'Todos', value: null },
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false },
      ],
    },
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsersPaginated(this.page(), this.limit()).subscribe({
      next: (response) => {
        this.users.set(response.results);
        this.total.set(response.count);
      },
      error: () => {
        this.toastrService.showError(
          'Error al obtener usuarios.',
          'Malas noticias'
        );
      },
    });
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: user.isActive ? 'Desactivar usuario' : 'Activar usuario',
        message:
          '¿Estás seguro de que deseas ' +
          (user.isActive ? 'desactivar' : 'activar') +
          ' este usuario?',
        buttonContent: user.isActive ? 'Desactivar' : 'Activar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.userService.deleteUser(user.id).subscribe(() => {
        this.loadUsers();
      });
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;
    if (file.type !== 'text/csv') return;

    const formData = new FormData();
    formData.append('file', file);

    this.userService.createUsersByCsv(formData).subscribe(() => {
      this.loadUsers();
    });
  }

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.limit.set(event.pageSize);
    this.loadUsers();
  }

  onSearch(filtros: Record<string, any>) {
    console.log('Buscar con: ', filtros);
  }
}
