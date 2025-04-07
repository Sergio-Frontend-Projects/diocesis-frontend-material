import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastrService } from '@core/services/toastr.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  toastrService = inject(ToastrService);

  router = inject(Router);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  isLoading = signal(false);

  onSubmit() {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;

    this.isLoading.set(true)

    this.auth.login(username!, password!).subscribe({
      next: () => {
        this.toastrService.showSuccess(username!, 'Bienvenido');
        this.router.navigateByUrl('/admin/users');
        this.isLoading.set(false)

      },
      error: (err) => {
        console.warn(err.error.detail);
        this.toastrService.showError(err.error.detail, 'Error');
        this.isLoading.set(false)

      },
    });
  }
}
