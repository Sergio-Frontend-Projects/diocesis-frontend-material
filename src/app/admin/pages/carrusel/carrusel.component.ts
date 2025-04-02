import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CarruselService } from '@core/services/carrusel.service';
import { Carrusel } from '@core/models/carrusel.model';
import { ToastrService } from '@core/services/toastr.service';

@Component({
  selector: 'app-carrusel',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.scss',
})
export default class CarruselComponent implements OnInit {
  private bannerService = inject(CarruselService);
  private toastrService = inject(ToastrService);

  banners = signal<Carrusel[]>([]);
  selectedFile = signal<File | null>(null);
  selectedFileName = signal<string>('');

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.bannerService.getAll().subscribe((data) => this.banners.set(data));
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedFile.set(file);
    this.selectedFileName.set(file.name);
  }

  deleteBanner(id: string) {
    this.bannerService.delete(id).subscribe(() => this.load());
  }

  uploadSelectedFile(fileInput: HTMLInputElement) {
    const file = this.selectedFile();
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const formData = new FormData();
    formData.append('url', file);
    formData.append('isImage', String(isImage));

    this.toastrService.showInfo('Subiendo archivo', 'Espere');

    this.bannerService.create(formData).subscribe({
      next: () => {
        this.toastrService.showSuccess('Archivo subido correctamente', 'Éxito');
        this.load();
        this.selectedFile.set(null);
        this.selectedFileName.set('');
        fileInput.value = '';
      },
      error: (err) => {
        this.toastrService.showSuccess(err.error, 'Error');
        console.error(err.error);
      },
    });
  }
}
