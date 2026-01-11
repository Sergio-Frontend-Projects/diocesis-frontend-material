import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TitleComponent } from '../../shared/components/title/title';
import { LucideAngularModule } from 'lucide-angular';
import { IconsService } from '../../core/services/icons.service';
import { ToastrService } from 'ngx-toastr';
import { Carousel } from './services/carousel';
import { Carrusel } from '../../core/models/carousel.model';
import { ModalComponent } from '../../shared/components/modal/modal';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, TitleComponent, LucideAngularModule, ModalComponent, EmptyState],
  templateUrl: './carousel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements OnInit {
  protected readonly iconsService = inject(IconsService);
  protected readonly carouselService = inject(Carousel);
  private readonly toastrService = inject(ToastrService);

  media = signal<Carrusel[]>([]);
  selectedFile = signal<File | null>(null);
  selectedFileName = signal<string>('');
  readonly confirmingDelete = signal(false);
  readonly fileToDelete = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.carouselService.getAll().subscribe((data) => this.media.set(data));
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedFile.set(file);
    this.selectedFileName.set(file.name);

    this.uploadSelectedFile();
  }

  uploadSelectedFile() {
    const file = this.selectedFile();
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const formData = new FormData();
    formData.append('url', file);
    formData.append('isImage', String(isImage));

    this.toastrService.info('Subiendo archivo', 'Espere');

    this.carouselService.create(formData).subscribe({
      next: () => {
        this.toastrService.success('Archivo subido correctamente', 'Éxito');
        this.load();
        this.selectedFile.set(null);
        this.selectedFileName.set('');
      },
      error: (err) => {
        this.toastrService.error(err.error, 'Error');
        console.error(err.error);
      },
    });
  }

  openDeleteModal(fileId: string) {
    this.fileToDelete.set(fileId);
    this.confirmingDelete.set(true);
  }

  confirmDelete() {
    const fileId = this.fileToDelete();
    if (!fileId) return;

    this.carouselService.delete(fileId).subscribe(() => {
      this.toastrService.success('Archivo eliminado correctamente', 'Éxito');
      this.load();
    });

    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.fileToDelete.set(null);
    this.confirmingDelete.set(false);
  }
}
