import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { USER_ROLES } from '@core/constants/user.constants';
import { User, UserRole } from '@core/models/user.model';
import { ToastrService } from '@core/services/toastr.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export default class UserFormComponent implements OnInit {
  fb = inject(FormBuilder);

  userService = inject(UserService);
  toastrService = inject(ToastrService);

  router = inject(Router);
  route = inject(ActivatedRoute);

  roles = USER_ROLES;

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: [''],
    role: ['user', Validators.required],
  });

  editing = false;
  userId: string | null = null;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.editing = true;
        this.userId = params['id'];
        this.userService.getUserById(this.userId || '').subscribe((user) => {
          this.form.patchValue(user);
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<User> = {
      username: formValue.username ?? '',
      email: formValue.email ?? '',
      role: (formValue.role ?? 'user') as UserRole,
    };

    if (!this.editing && formValue.password) {
      (payload as any).password = formValue.password;
    }

    const action = this.editing
      ? this.userService.updateUser(this.userId!, payload)
      : this.userService.createUser(payload);

    action.subscribe({
      next: () => {
        this.toastrService.showSuccess(
          this.editing ? 'Usuario actualizado' : 'Usuario creado',
          'Éxito'
        );
        this.router.navigateByUrl('/admin/users');
      },
      error: () => {
        this.toastrService.showError(
          'Error al guardar el usuario',
          'Malas noticias'
        );
      },
    });
  }
}
