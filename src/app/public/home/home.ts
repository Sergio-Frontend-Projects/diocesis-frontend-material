import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Carousel } from '../../admin/carousel/services/carousel';
import { Carrusel } from '../../core/models/carousel.model';
import { CarouselComponent } from '../../shared/components/carousel/carousel';
import { NewsSliderComponent } from '../../shared/components/news-slider/news-slider';
import { SearchCardComponent } from '../../shared/components/search-card/search-card';
import { Newspaper } from '../../admin/newspaper/services/newspaper';
import { Noticia } from '../../core/models/newspaper.model';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CarouselComponent, NewsSliderComponent, SearchCardComponent],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private readonly title = inject(Title);
  protected readonly carouselService = inject(Carousel);
  protected readonly postsService = inject(Newspaper);

  protected carouselContent = signal<Carrusel[]>([]);
  protected latestPosts = signal<Noticia[]>([]);

  ngOnInit(): void {
    this.title.setTitle('Diócesis de Ciudad Obregón');
    this.loadData();
  }

  private loadData(): void {
    combineLatest([
      this.carouselService.getAll(),
      this.postsService.getNoticiasPaginated(0, 10, { isActive: true }),
    ]).subscribe({
      next: ([carruselItems, posts]) => {
        const activeItems = carruselItems.filter((item) => item.isActive);
        this.carouselContent.set(activeItems);
        this.latestPosts.set(posts.results);
      },
    });
  }
}
