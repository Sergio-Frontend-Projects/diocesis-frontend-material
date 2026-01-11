import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Carrusel } from '../../../core/models/carousel.model';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { IconsService } from '../../../core/services/icons.service';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './carousel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements OnInit, OnDestroy {
  protected readonly iconsService = inject(IconsService);

  items = input.required<Carrusel[]>();

  protected currentIndex = signal(0);
  protected isTransitioning = signal(false);

  private autoPlayInterval?: number;
  private readonly autoPlayDelay = 8000;
  private videoObserver?: IntersectionObserver;
  private isPlayingVideo = signal(false);

  protected readonly videoElement = viewChild<ElementRef<HTMLVideoElement>>('carouselVideo');

  constructor() {
    // Effect para manejar la reproducción del video cuando cambia el índice
    effect(() => {
      const index = this.currentIndex();
      const content = this.items();
      if (content[index] && !content[index].isImage) {
        this.isPlayingVideo.set(true);
        this.setupVideoPlayback();
      } else {
        this.isPlayingVideo.set(false);
        // Reiniciar auto-play si es una imagen
        if (content.length > 0) {
          this.startAutoPlay();
        }
      }
    });
  }

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    this.videoObserver?.disconnect();
  }

  protected next(): void {
    if (this.isTransitioning()) return;
    this.pauseAndResetCurrentVideo();
    this.isTransitioning.set(true);
    const items = this.items();
    this.currentIndex.set((this.currentIndex() + 1) % items.length);
    this.resetAutoPlay();
    setTimeout(() => this.isTransitioning.set(false), 500);
  }

  protected previous(): void {
    if (this.isTransitioning()) return;
    this.pauseAndResetCurrentVideo();
    this.isTransitioning.set(true);
    const items = this.items();
    this.currentIndex.set((this.currentIndex() - 1 + items.length) % items.length);
    this.resetAutoPlay();
    setTimeout(() => this.isTransitioning.set(false), 500);
  }

  protected goToSlide(index: number): void {
    if (this.isTransitioning() || index === this.currentIndex()) return;
    this.pauseAndResetCurrentVideo();
    this.isTransitioning.set(true);
    this.currentIndex.set(index);
    this.resetAutoPlay();
    setTimeout(() => this.isTransitioning.set(false), 500);
  }

  private startAutoPlay(): void {
    this.stopAutoPlay();
    // No iniciar auto-play si el slide actual es un video
    const currentItem = this.items()[this.currentIndex()];
    if (currentItem && !currentItem.isImage) {
      return; // El video manejará el avance cuando termine
    }
    this.autoPlayInterval = window.setInterval(() => {
      this.next();
    }, this.autoPlayDelay);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = undefined;
    }
  }

  private resetAutoPlay(): void {
    this.startAutoPlay();
  }

  private setupIntersectionObserver(): void {
    this.videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Silently handle autoplay errors
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 },
    );
  }

  private setupVideoPlayback(): void {
    setTimeout(() => {
      const video = this.videoElement()?.nativeElement;
      if (video) {
        // Desconectar observador anterior si existe
        if (this.videoObserver) {
          this.videoObserver.disconnect();
          this.setupIntersectionObserver();
        }
        // Reiniciar el video desde el inicio
        video.currentTime = 0;
        // Observar el nuevo video
        if (this.videoObserver) {
          this.videoObserver.observe(video);
        }
      }
    }, 100);
  }

  private pauseAndResetCurrentVideo(): void {
    const currentItem = this.items()[this.currentIndex()];
    if (currentItem && !currentItem.isImage) {
      const video = this.videoElement()?.nativeElement;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
  }

  protected onVideoEnded(): void {
    // Reiniciar el video para la próxima vez que se muestre
    const video = this.videoElement()?.nativeElement;
    if (video) {
      video.currentTime = 0;
    }
    // Cuando el video termina, avanzar al siguiente slide
    this.next();
  }
}
