import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BannerService } from '@core/services/banner.service';
import { Banner } from '@core/models/banner.model';
import { ToastrService } from '@core/services/toastr.service';

@Component({
  selector: 'app-banners',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.scss',
})
export default class BannersComponent implements OnInit {
  private bannerService = inject(BannerService);
  private toastrService = inject(ToastrService);

  banners = signal<Banner[]>([]);
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
