import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Decanato } from '@core/models/decanato.model';
import { DecanatoService } from '@core/services/decanato.service';
import { ToastrService } from '@core/services/toastr.service';

@Component({
  selector: 'app-decanato-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './decanato-form.component.html',
  styleUrl: './decanato-form.component.scss',
})
export default class DecanatoFormComponent implements OnInit {
  fb = inject(FormBuilder);

  decanatoService = inject(DecanatoService);
  toastrService = inject(ToastrService);

  router = inject(Router);
  route = inject(ActivatedRoute);

  editing = false;
  decanatoId?: string;

  form = this.fb.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');

      if (!id) return;

      this.editing = true;
      this.decanatoId = id;
      this.decanatoService.getDecanatoById(this.decanatoId).subscribe({
        next: (decanato) => this.form.patchValue(decanato),
      });
    }

    onSubmit() {
      if (this.form.invalid) return;

      const formValue = this.form.value;
      const payload: Partial<Decanato> = {
        name: formValue.name ?? '',
      };

      const action = this.editing
        ? this.decanatoService.updateDecanato(this.decanatoId!, payload)
        : this.decanatoService.createDecanato(payload);

      action.subscribe({
        next: () => {
          this.toastrService.showSuccess(
            this.editing ? 'Decanato actualizado' : 'Decanato creado',
            'Éxito'
          );
          this.router.navigateByUrl('/admin/decanatos');
        },
        error: () => {
          this.toastrService.showError(
            'Error al guardar el decanato',
            'Malas noticias'
          );
        },
      });
    }
}
