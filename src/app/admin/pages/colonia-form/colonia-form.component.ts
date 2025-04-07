import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Colonia } from '@core/models/colonia.model';
import { ColoniaService } from '@core/services/colonia.service';
import { ToastrService } from '@core/services/toastr.service';

@Component({
  selector: 'app-colonia-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './colonia-form.component.html',
  styleUrl: './colonia-form.component.scss',
})
export default class ColoniaFormComponent implements OnInit {
  fb = inject(FormBuilder);

  coloniaService = inject(ColoniaService);
  toastrService = inject(ToastrService);

  router = inject(Router);
  route = inject(ActivatedRoute);

  editing = false;
  coloniaId?: string;

  form = this.fb.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.editing = true;
    this.coloniaId = id;
    this.coloniaService.getColoniaById(this.coloniaId).subscribe({
      next: (colonia) => this.form.patchValue(colonia),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<Colonia> = {
      name: formValue.name ?? '',
    };

    const action = this.editing
      ? this.coloniaService.updateColonia(this.coloniaId!, payload)
      : this.coloniaService.createColonia(payload);

    action.subscribe({
      next: () => {
        this.toastrService.showSuccess(
          this.editing ? 'Colonia actualizado' : 'Colonia creada',
          'Éxito'
        );
        this.router.navigateByUrl('/admin/colonias');
      },
      error: () => {
        this.toastrService.showError(
          'Error al guardar la colonia',
          'Malas noticias'
        );
      },
    });
  }
}
