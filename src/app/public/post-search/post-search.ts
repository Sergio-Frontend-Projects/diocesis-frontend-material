import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Newspaper } from '../../admin/newspaper/services/newspaper';
import { CleanUrlPipe } from '../../core/pipes/clean-url.pipe';
import { IconsService } from '../../core/services/icons.service';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { PaginationComponent } from '../../shared/components/pagination/pagination';
import { createPaginationState } from '../../shared/utils/pagination.util';
import { createSearchState } from '../../shared/utils/search.util';

@Component({
  selector: 'app-post-search',
  imports: [
    CommonModule,
    LucideAngularModule,
    CleanUrlPipe,
    EmptyState,
    PaginationComponent,
    RouterModule,
  ],
  templateUrl: './post-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostSearch implements OnInit {
  private readonly title = inject(Title);
  private readonly route = inject(ActivatedRoute);
  protected readonly iconsService = inject(IconsService);
  protected readonly newspaperService = inject(Newspaper);

  readonly loading = signal(false);

  private readonly paginationState = createPaginationState(this.newspaperService.totalNews, {
    onChange: () => this.loadNews(),
  });

  readonly pagination = this.paginationState.pagination;
  readonly pageFrom = this.paginationState.pageFrom;
  readonly pageTo = this.paginationState.pageTo;
  readonly canPrev = this.paginationState.canPrev;
  readonly canNext = this.paginationState.canNext;

  prevPage = () => this.paginationState.prevPage();
  nextPage = () => this.paginationState.nextPage();
  changeLimit = (e: Event) => this.paginationState.changeLimit(e);

  private readonly searchTitleState = createSearchState({
    onSearch: () => {
      this.paginationState.resetToFirstPage();
      this.loadNews();
    },
  });

  private readonly searchTagsState = createSearchState({
    onSearch: () => {
      this.paginationState.resetToFirstPage();
      this.loadNews();
    },
  });

  readonly searchTitle = this.searchTitleState.searchTerm;
  readonly searchTags = this.searchTagsState.searchTerm;

  updateTitleSearch = (e: Event) => this.searchTitleState.updateSearch(e);
  updateTagsSearch = (e: Event) => this.searchTagsState.updateSearch(e);

  ngOnInit(): void {
    this.title.setTitle('Noticias - Diócesis de Ciudad Obregón');
    const param = this.route.snapshot.paramMap.get('tag');

    if (!param) this.loadNews();
    else this.loadNews(param);
  }

  loadNews(tag: string = '') {
    this.loading.set(true);
    const { limit, offset } = this.pagination();

    const tagValue = tag ? tag : this.searchTags();

    console.log(tagValue);

    this.newspaperService
      .getNoticiasPaginated(offset, limit, {
        title: this.searchTitle(),
        tags: tagValue,
        isActive: true,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
