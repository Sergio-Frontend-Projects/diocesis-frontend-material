import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { ToastrService } from '../../../core/services/toastr.service';

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

  tempUsers: User[] = [
    {
      id: '1',
      username: 'Sergio',
      email: 'sergiobg.isc@gmail.com',
      role: 'super',
      isActive: true,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    },
    {
      id: '2',
      username: 'Sergio',
      email: 'sergiobg.isc@gmail.com',
      role: 'admin',
      isActive: false,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    },
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsersPaginated(this.page(), this.limit()).subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.total.set(response.total);
      },
      error: () => {
        this.toastrService.showError('Error al obtener usuarios.', 'Malas noticias');
      },
    });
  }

  deleteUser(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Desactivar usuario',
        message: '¿Estás seguro de que deseas desactivar este usuario?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.userService.deleteUser(id).subscribe(() => {
        this.users.update((users) => users.filter((u) => u.id !== id));
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
}
