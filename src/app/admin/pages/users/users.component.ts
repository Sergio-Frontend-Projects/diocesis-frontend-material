import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export default class UsersComponent implements OnInit {
  private userService = inject(UserService);
  users = signal<any[]>([]);

  tempUsers = [
    { id: 1, name: 'Sergio', email: 'text' },
    { id: 2, name: 'Ricardo', email: 'text' },
  ];

  displayedColumns = ['id', 'name', 'email', 'actions'];

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => this.users.set(data));
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(() => {
      this.users.update((users) => users.filter((u) => u.id !== id));
    });
  }
}
