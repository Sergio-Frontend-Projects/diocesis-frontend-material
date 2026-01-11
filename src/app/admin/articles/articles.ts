import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TitleComponent } from '../../shared/components/title/title';
import { PaginationComponent } from '../../shared/components/pagination/pagination';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { ModalComponent } from '../../shared/components/modal/modal';
import { LucideAngularModule } from 'lucide-angular';
import { Article } from './services/article';
import { ToastrService } from 'ngx-toastr';
import { IconsService } from '../../core/services/icons.service';
import { Articulo } from '../../core/models/article.model';
import { ArticleForm, Mode } from '../../shared/models/common.models';
import { createPaginationState } from '../../shared/utils/pagination.util';
import { createSearchState } from '../../shared/utils/search.util';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-articles',
  imports: [
    CommonModule,
    TitleComponent,
    PaginationComponent,
    EmptyState,
    ModalComponent,
    LucideAngularModule,
  ],
  templateUrl: './articles.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent implements OnInit {
  private readonly toastrService = inject(ToastrService);
  protected readonly iconsService = inject(IconsService);
  protected readonly articleService = inject(Article);

  readonly confirmingToggle = signal(false);
  readonly targetArticle = signal<Articulo | null>(null);
  readonly targetAction = signal<'activate' | 'deactivate' | null>(null);
  readonly filters = signal<{ isActive?: boolean }>({});

  readonly loading = signal(false);
  readonly mode = signal<Mode>(null);
  readonly saving = signal(false);

  readonly createForm = signal<ArticleForm>({
    title: '',
    content: '',
    tags: '',
  });

  private readonly paginationState = createPaginationState(this.articleService.totalArticles, {
    onChange: () => this.loadArticles(),
  });

  private readonly searchNameState = createSearchState({
    onSearch: () => {
      this.paginationState.resetToFirstPage();
      this.loadArticles();
    },
  });

  private readonly searchTagsState = createSearchState({
    onSearch: () => {
      this.paginationState.resetToFirstPage();
      this.loadArticles();
    },
  });

  readonly pagination = this.paginationState.pagination;
  readonly pageFrom = this.paginationState.pageFrom;
  readonly pageTo = this.paginationState.pageTo;
  readonly canPrev = this.paginationState.canPrev;
  readonly canNext = this.paginationState.canNext;

  prevPage = () => this.paginationState.prevPage();
  nextPage = () => this.paginationState.nextPage();
  changeLimit = (e: Event) => this.paginationState.changeLimit(e);

  readonly searchTitle = this.searchNameState.searchTerm;
  readonly searchTags = this.searchTagsState.searchTerm;

  updateTitleSearch = (e: Event) => this.searchNameState.updateSearch(e);
  updateTagsSearch = (e: Event) => this.searchTagsState.updateSearch(e);

  readonly activeFilterValue = computed(() => {
    const isActive = this.filters().isActive;
    if (isActive === undefined) return '';
    return isActive ? 'true' : 'false';
  });

  readonly modalTitle = computed(() => {
    const currentMode = this.mode();
    if (currentMode === 'create') return 'Crear Artículo';
    if (currentMode === 'edit') return 'Editar Artículo';
    return '';
  });

  readonly isCreateFormValid = computed(() => {
    const f = this.createForm();

    return f.title.trim() !== '' && f.content.trim() !== '' && f.tags.trim() !== '';
  });

  readonly toggleConfirmTitle = computed(() =>
    this.targetAction() === 'activate' ? 'Activar artículo' : 'Desactivar artículo',
  );

  readonly toggleConfirmMessage = computed(() => {
    const action = this.targetAction() === 'activate' ? 'activar' : 'desactivar';
    return `¿Seguro que quieres ${action} "${this.targetArticle()?.title}"?`;
  });

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles() {
    this.loading.set(true);
    const { limit, offset } = this.pagination();

    this.articleService
      .getArticulosPaginated(offset, limit, {
        title: this.searchTitle(),
        tags: this.searchTags(),
        isActive: this.filters().isActive,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.toastrService.error('Error al cargar los artículos', 'Error');
          this.loading.set(false);
        },
      });
  }

  openCreateArticle() {
    this.mode.set('create');
    this.createForm.set({
      title: '',
      content: '',
      tags: '',
    });
  }

  openEditArticle(row: Articulo) {
    this.mode.set('edit');
    this.createForm.set({
      title: row.title,
      content: row.content,
      tags: row.tags.join(','),
    });

    this.targetArticle.set(row);
  }

  closeModal() {
    this.mode.set(null);
    this.resetCreateForm();
  }

  confirmToggleArticle(article: Articulo, action: 'activate' | 'deactivate') {
    this.targetArticle.set(article);
    this.targetAction.set(action);
    this.confirmingToggle.set(true);
  }

  closeToggleConfirmation(): void {
    this.confirmingToggle.set(false);
    this.targetArticle.set(null);
    this.targetAction.set(null);
  }

  executeToggle(): void {
    const article = this.targetArticle();
    const action = this.targetAction();

    if (!article || !action) return;

    if (action === 'activate') this.activateArticle(article);
    else this.deleteArticle(article);

    this.closeToggleConfirmation();
  }

  activateArticle(row: Articulo) {
    this.articleService
      .activateArticulo(row.id)
      .pipe(
        catchError((e) => {
          console.error(e);
          this.toastrService.error('Error al activar artículo');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.toastrService.success('Artículo activado correctamente', 'Éxito');
        this.loadArticles();
      });
  }

  deleteArticle(row: Articulo) {
    this.articleService
      .deleteArticulo(row.id)
      .pipe(
        catchError((e) => {
          console.error(e);
          this.toastrService.error('Error al desactivar artículo');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.toastrService.success('Artículo desactivado correctamente', 'Éxito');
        this.loadArticles();
      });
  }

  save() {
    if (!this.isCreateFormValid()) {
      this.toastrService.warning('Revise la información proporcionada', 'Formulario inválido');
      return;
    }

    const { title, tags, content } = this.createForm();

    const payload: Partial<Articulo> = {
      title,
      content,
      tags: tags.split(',').map((tag) => tag.trim()),
    };

    this.saving.set(true);

    const action =
      this.mode() === 'create'
        ? this.articleService.createArticulo(payload)
        : this.articleService.updateArticulo(this.targetArticle()?.id!, payload);

    action.subscribe({
      next: () => {
        this.toastrService.success('Artículo creado correctamente', 'Éxito');
        this.closeModal();
        this.loadArticles();
        this.saving.set(false);
      },
      error: () => {
        this.toastrService.error('Error al guardar artículo', 'Error');
        this.saving.set(false);
      },
    });
  }

  updateFilterActive(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    let isActive: boolean | undefined;

    if (value === '') {
      isActive = undefined;
    } else if (value === 'true') {
      isActive = true;
    } else if (value === 'false') {
      isActive = false;
    }

    this.filters.update((f) => ({ ...f, isActive }));
    this.paginationState.resetToFirstPage();
    this.loadArticles();
  }

  updateCreateFormField(field: keyof ArticleForm, e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.createForm.update((f) => ({ ...f, [field]: value }));
  }

  private resetCreateForm() {
    this.createForm.set({
      title: '',
      content: '',
      tags: '',
    });
  }
}
