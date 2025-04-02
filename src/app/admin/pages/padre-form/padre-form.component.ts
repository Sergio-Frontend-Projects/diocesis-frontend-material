import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PadreService } from '@core/services/padre.service';
import { ToastrService } from '@core/services/toastr.service';

@Component({
  selector: 'app-padre-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './padre-form.component.html',
  styleUrl: './padre-form.component.scss',
})
export default class PadreFormComponent implements OnInit {
  fb = inject(FormBuilder);

  padreService = inject(PadreService);
  toastrService = inject(ToastrService);

  router = inject(Router);
  route = inject(ActivatedRoute);

  selectedFile = signal<File | null>(null);
  selectedFileName = signal<string>('');

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthDate: ['', Validators.required],
  });

  editing = false;
  padreId?: string;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.editing = true;
        this.padreId = params['id'];
        this.padreService
          .getPadreById(this.padreId || '')
          .subscribe((padre) => {
            this.form.patchValue({
              firstName: padre.firstName,
              lastName: padre.lastName,
              birthDate: padre.birthDate,
            });
          });
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedFile.set(file);
    this.selectedFileName.set(file.name);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const file = this.selectedFile();
    const formValue = this.form.value;
    const formData = new FormData();

    formData.append('firstName', formValue.firstName ?? '');
    formData.append('lastName', formValue.lastName ?? '');
    formData.append(
      'birthDate',
      new Date(formValue.birthDate ?? '').toISOString().split('T')[0]
    );
    formData.append('isActive', String(true));

    if (file !== null) formData.append('picture', file);

    const action = this.editing
      ? this.padreService.updatePadre(this.padreId!, formData)
      : this.padreService.createPadre(formData);

    this.toastrService.showInfo('Creado padre', 'Espere');

    action.subscribe({
      next: () => {
        this.toastrService.showSuccess(
          this.editing ? 'Padre actualizado' : 'Padre creado',
          'Éxito'
        );
        this.router.navigateByUrl('/admin/padres');
      },
      error: (err) => {
        console.error(err);
        this.toastrService.showError(
          'Error al guardar el padre',
          'Malas noticias'
        );
      },
    });
  }
}
