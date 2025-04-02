import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NoticiaService } from '@core/services/noticia.service';
import { ToastrService } from '@core/services/toastr.service';

@Component({
  selector: 'app-noticia-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './noticia-form.component.html',
  styleUrl: './noticia-form.component.scss',
})
export default class NoticiaFormComponent implements OnInit {
  fb = inject(FormBuilder);

  noticiaService = inject(NoticiaService);
  toastrService = inject(ToastrService);

  router = inject(Router);
  route = inject(ActivatedRoute);

  selectedFile = signal<File | null>(null);
  selectedFileName = signal<string>('');

  form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    tags: ['', Validators.required],
  });

  editing = false;
  noticiaId?: string;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.editing = true;
        this.noticiaId = params['id'];
        this.noticiaService
          .getNoticiaById(this.noticiaId || '')
          .subscribe((noticia) => {
            this.form.patchValue({
              title: noticia.title,
              content: noticia.content,
              tags: noticia.tags.join(','),
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
    const { title, content, tags } = this.form.value;
    const formData = new FormData();

    formData.append('title', title ?? '');
    formData.append('content', content ?? '');

    if (tags) {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      formData.append('tags', JSON.stringify(tagList));
    }

    if (file !== null) formData.append('picture', file);

    for (const element of formData.entries()) {
      console.log(element);
    }

    const action = this.editing
      ? this.noticiaService.updateNoticia(this.noticiaId!, formData)
      : this.noticiaService.createNoticia(formData);

    this.toastrService.showInfo('Guardando noticia', 'Espere');

    action.subscribe({
      next: () => {
        this.toastrService.showSuccess(
          this.editing ? 'Noticia actualizada' : 'Noticia creada',
          'Éxito'
        );
        this.router.navigateByUrl('/admin/noticias');
      },
      error: (err) => {
        console.error(err);
        this.toastrService.showError(
          'Error al guardar el noticia',
          'Malas noticias'
        );
      },
    });
  }
}
