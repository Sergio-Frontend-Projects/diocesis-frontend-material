import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Noticia } from '../../../core/models/newspaper.model';
import { LucideAngularModule } from 'lucide-angular';
import { IconsService } from '../../../core/services/icons.service';
import { CleanUrlPipe } from '../../../core/pipes/clean-url.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-news-slider',
  imports: [CommonModule, LucideAngularModule, CleanUrlPipe, RouterModule],
  templateUrl: './news-slider.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsSliderComponent implements OnDestroy {
  protected readonly iconsService = inject(IconsService);

  news = input.required<Noticia[]>();

  protected scrollPosition = signal(0);
  private autoScrollInterval?: number;
  private readonly autoScrollDelay = 5000; // 5 segundos

  constructor() {
    effect(() => {
      if (this.news().length > 0) {
        this.startAutoScroll();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  protected scrollLeft(): void {
    const container = document.getElementById('news-slider-container');
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' });
      this.resetAutoScroll();
    }
  }

  protected scrollRight(): void {
    const container = document.getElementById('news-slider-container');
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' });
      this.resetAutoScroll();
    }
  }

  private startAutoScroll(): void {
    this.stopAutoScroll();
    if (this.news().length <= 1) return;

    this.autoScrollInterval = window.setInterval(() => {
      const container = document.getElementById('news-slider-container');
      if (container) {
        // Si llegamos al final, volver al inicio
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }
    }, this.autoScrollDelay);
  }

  private stopAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = undefined;
    }
  }

  private resetAutoScroll(): void {
    this.startAutoScroll();
  }

  protected truncateContent(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}
