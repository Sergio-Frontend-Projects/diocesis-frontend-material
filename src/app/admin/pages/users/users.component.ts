import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

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
  users = signal<User[]>([]);

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
    this.users.set(this.tempUsers);
    //this.userService.getUsers().subscribe((data) => this.users.set(data));
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(() => {
      this.users.update((users) => users.filter((u) => u.id !== id));
    });
  }
}
