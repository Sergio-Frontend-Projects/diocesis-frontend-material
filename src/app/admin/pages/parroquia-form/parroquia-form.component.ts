import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Colonia } from '@core/models/colonia.model';
import { Decanato } from '@core/models/decanato.model';
import { Padre } from '@core/models/padre.model';
import { ColoniaService } from '@core/services/colonia.service';
import { DecanatoService } from '@core/services/decanato.service';
import { PadreService } from '@core/services/padre.service';
import { ParroquiaService } from '@core/services/parroquia.service';
import { ToastrService } from '@core/services/toastr.service';

@Component({
  selector: 'app-parroquia-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './parroquia-form.component.html',
  styleUrl: './parroquia-form.component.scss',
})
export default class ParroquiaFormComponent implements OnInit {
  fb = inject(FormBuilder);

  parroquiaService = inject(ParroquiaService);
  coloniaService = inject(ColoniaService);
  decanatoService = inject(DecanatoService);
  padreService = inject(PadreService);
  toastrService = inject(ToastrService);

  router = inject(Router);
  route = inject(ActivatedRoute);

  colonias = signal<Colonia[]>([]);
  decanatos = signal<Decanato[]>([]);
  padres = signal<Padre[]>([]);

  selectedFile = signal<File | null>(null);
  selectedFileName = signal<string>('');

  form = this.fb.group({
    name: ['', Validators.required],
    openingDate: ['', Validators.required],
    address: ['', Validators.required],
    zipCode: ['', Validators.required],
    town: ['', Validators.required],
    coloniaId: ['', Validators.required],
    decanatoId: ['', Validators.required],
    padreId: ['', Validators.required],
  });

  editing = false;
  parroquiaId?: string;

  ngOnInit(): void {
    this.loadListas();

    this.parroquiaId = this.route.snapshot.paramMap.get('id') ?? '';

    if (this.parroquiaId !== '') {
      this.editing = true;
      this.parroquiaService
        .getParroquiaById(this.parroquiaId)
        .subscribe((data) => {
          this.form.patchValue(data);
        });
    }
  }

  loadListas() {
    this.coloniaService
      .getColoniasPaginated(0, 100)
      .subscribe((res) => this.colonias.set(res.results));

    this.decanatoService
      .getDecanatosPaginated(0, 100)
      .subscribe((res) => this.decanatos.set(res.results));

    this.padreService
      .getPadresPaginated(0, 100)
      .subscribe((res) => this.padres.set(res.results));
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

    formData.append('name', formValue.name ?? '');
    formData.append(
      'openingDate',
      new Date(formValue.openingDate ?? '').toISOString().split('T')[0]
    );
    formData.append('address', formValue.address ?? '');
    formData.append('zipCode', formValue.zipCode ?? '');
    formData.append('town', formValue.town ?? '');
    formData.append('decanatoId', formValue.decanatoId ?? '');
    formData.append('coloniaId', formValue.coloniaId ?? '');
    formData.append('padreId', formValue.padreId ?? '');

    if (file !== null) formData.append('picture', file);

    const action = this.editing
      ? this.parroquiaService.updateParroquia(this.parroquiaId!, formData)
      : this.parroquiaService.createParroquia(formData);

    this.toastrService.showInfo('Guardando parroquia', 'Espere');

    action.subscribe({
      next: () => {
        this.toastrService.showSuccess(
          this.editing ? 'Parroquia actualizada' : 'Parroquia creada',
          'Éxito'
        );
        this.router.navigateByUrl('/admin/parroquias');
      },
      error: (err) => {
        console.error(err);
        this.toastrService.showError(
          'Error al guardar la parroquia',
          'Malas noticias'
        );
      },
    });
  }
}
