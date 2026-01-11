import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Parish } from '../../admin/parishes/services/parish';
import { CleanUrlPipe } from '../../core/pipes/clean-url.pipe';
import { IconsService } from '../../core/services/icons.service';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { PaginationComponent } from '../../shared/components/pagination/pagination';
import { createPaginationState } from '../../shared/utils/pagination.util';
import { createSearchState } from '../../shared/utils/search.util';

@Component({
  selector: 'app-parish-search',
  imports: [
    CommonModule,
    LucideAngularModule,
    CleanUrlPipe,
    EmptyState,
    PaginationComponent,
    RouterModule,
  ],
  templateUrl: './parish-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParishSearch implements OnInit {
  private readonly title = inject(Title);
  protected readonly iconsService = inject(IconsService);
  protected readonly parishesService = inject(Parish);

  readonly loading = signal(false);

  private readonly paginationState = createPaginationState(this.parishesService.totalParishes, {
    onChange: () => this.loadParishes(),
  });

  readonly pagination = this.paginationState.pagination;
  readonly pageFrom = this.paginationState.pageFrom;
  readonly pageTo = this.paginationState.pageTo;
  readonly canPrev = this.paginationState.canPrev;
  readonly canNext = this.paginationState.canNext;

  prevPage = () => this.paginationState.prevPage();
  nextPage = () => this.paginationState.nextPage();
  changeLimit = (e: Event) => this.paginationState.changeLimit(e);

  private readonly searchNameState = createSearchState({
    onSearch: () => {
      this.paginationState.resetToFirstPage();
      this.loadParishes();
    },
  });

  readonly searchName = this.searchNameState.searchTerm;
  updateNameSearch = (e: Event) => this.searchNameState.updateSearch(e);

  ngOnInit(): void {
    this.title.setTitle('Parroquias - Diócesis de Ciudad Obregón');
    this.loadParishes();
  }

  loadParishes() {
    this.loading.set(true);
    const { limit, offset } = this.pagination();

    this.parishesService
      .getParroquiasPaginated(offset, limit, {
        name: this.searchName(),
        isActive: true, // Solo mostrar padres activos en la vista pública
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
