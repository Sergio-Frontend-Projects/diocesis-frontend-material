import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { Noticia } from '../../core/models/newspaper.model';
import { CleanUrlPipe } from '../../core/pipes/clean-url.pipe';
import { IconsService } from '../../core/services/icons.service';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { ModalComponent } from '../../shared/components/modal/modal';
import { PaginationComponent } from '../../shared/components/pagination/pagination';
import { TitleComponent } from '../../shared/components/title/title';
import { Mode, NewspaperForm } from '../../shared/models/common.models';
import { createPaginationState } from '../../shared/utils/pagination.util';
import { createSearchState } from '../../shared/utils/search.util';
import { Newspaper } from './services/newspaper';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-newspaper',
  imports: [
    CommonModule,
    TitleComponent,
    PaginationComponent,
    EmptyState,
    ModalComponent,
    LucideAngularModule,
    CleanUrlPipe,
  ],
  templateUrl: './newspaper.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewspaperComponent implements OnInit {
  private readonly toastrService = inject(ToastrService);
  protected readonly iconsService = inject(IconsService);
  protected readonly newspaperService = inject(Newspaper);
  private readonly sanitizer = inject(DomSanitizer);

  readonly confirmingToggle = signal(false);
  readonly targetNew = signal<Noticia | null>(null);
  readonly targetAction = signal<'activate' | 'deactivate' | null>(null);
  readonly filters = signal<{ isActive?: boolean }>({});

  readonly loading = signal(false);
  readonly mode = signal<Mode>(null);
  readonly saving = signal(false);
  readonly photoPreview = signal<SafeUrl | null>(null);
  selectedFile = signal<File | null>(null);
  selectedFileName = signal<string | null>(null);

  readonly createForm = signal<NewspaperForm>({
    title: '',
    content: '',
    tags: '',
  });

  private readonly paginationState = createPaginationState(this.newspaperService.totalNews, {
    onChange: () => this.loadNews(),
  });

  private readonly searchNameState = createSearchState({
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
    if (currentMode === 'create') return 'Crear Noticia';
    if (currentMode === 'edit') return 'Editar Noticia';
    return '';
  });

  readonly isCreateFormValid = computed(() => {
    const f = this.createForm();

    return f.title.trim() !== '' && f.content.trim() !== '' && f.tags.trim() !== '';
  });

  readonly toggleConfirmTitle = computed(() =>
    this.targetAction() === 'activate' ? 'Activar noticia' : 'Desactivar noticia',
  );

  readonly toggleConfirmMessage = computed(() => {
    const action = this.targetAction() === 'activate' ? 'activar' : 'desactivar';
    return `¿Seguro que quieres ${action} "${this.targetNew()?.title}"?`;
  });

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews() {
    this.loading.set(true);
    const { limit, offset } = this.pagination();

    this.newspaperService
      .getNoticiasPaginated(offset, limit, {
        title: this.searchTitle(),
        tags: this.searchTags(),
        isActive: this.filters().isActive,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.toastrService.error('Error al cargar las noticias', 'Error');
          this.loading.set(false);
        },
      });
  }

  openCreateNew() {
    this.mode.set('create');
    this.createForm.set({
      title: '',
      content: '',
      tags: '',
    });
  }

  openEditNew(row: Noticia) {
    this.mode.set('edit');
    this.createForm.set({
      title: row.title,
      content: row.content,
      tags: row.tags.join(','),
    });

    this.targetNew.set(row);
  }

  closeModal() {
    this.mode.set(null);
    this.resetCreateForm();
    this.photoPreview.set(null); // Reiniciar la vista previa de la foto
    this.selectedFile.set(null); // Reiniciar el archivo seleccionado
    this.selectedFileName.set(null); // Reiniciar el nombre del archivo

    const photoInput = document.getElementById('photo') as HTMLInputElement | null;
    if (photoInput) {
      photoInput.value = ''; // Reiniciar el valor del input de archivo
    }
  }

  confirmToggleNew(newPost: Noticia, action: 'activate' | 'deactivate') {
    this.targetNew.set(newPost);
    this.targetAction.set(action);
    this.confirmingToggle.set(true);
  }

  closeToggleConfirmation(): void {
    this.confirmingToggle.set(false);
    this.targetNew.set(null);
    this.targetAction.set(null);
  }

  executeToggle(): void {
    const newPost = this.targetNew();
    const action = this.targetAction();

    if (!newPost || !action) return;

    if (action === 'activate') this.activateNew(newPost);
    else this.deleteNew(newPost);

    this.closeToggleConfirmation();
  }

  activateNew(row: Noticia) {
    this.newspaperService
      .activateNoticia(row.id)
      .pipe(
        catchError((e) => {
          console.error(e);
          this.toastrService.error('Error al activar noticia');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.toastrService.success('Noticia activada correctamente', 'Éxito');
        this.loadNews();
      });
  }

  deleteNew(row: Noticia) {
    this.newspaperService
      .deleteNoticia(row.id)
      .pipe(
        catchError((e) => {
          console.error(e);
          this.toastrService.error('Error al desactivar noticia');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.toastrService.success('Noticia desactivada correctamente', 'Éxito');
        this.loadNews();
      });
  }

  save() {
    if (!this.isCreateFormValid()) {
      this.toastrService.warning('Revise la información proporcionada', 'Formulario inválido');
      return;
    }

    const { title, tags, content } = this.createForm();

    const file = this.selectedFile();

    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);

    const tagsList = tags.split(',').map((tag) => tag.trim());
    formData.append('tags', JSON.stringify(tagsList));

    if (file !== null) formData.append('picture', file);

    this.saving.set(true);

    const action =
      this.mode() === 'create'
        ? this.newspaperService.createNoticia(formData)
        : this.newspaperService.updateNoticia(this.targetNew()?.id!, formData);

    action.subscribe({
      next: () => {
        this.toastrService.success('Noticia creada correctamente', 'Éxito');
        this.closeModal();
        this.loadNews();
        this.saving.set(false);
      },
      error: () => {
        this.toastrService.error('Error al guardar noticia', 'Error');
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
    this.loadNews();
  }

  updateCreateFormField(field: keyof NewspaperForm, e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.createForm.update((f) => ({ ...f, [field]: value }));
  }

  onPhotoUpload(event: Event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado
    event.stopPropagation(); // Prevenir la propagación del evento

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile.set(file);
    this.selectedFileName.set(file.name);

    try {
      const objectUrl = URL.createObjectURL(file);
      this.photoPreview.set(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
    } catch (error) {
      console.error('Error al generar la URL de vista previa:', error);
      this.photoPreview.set(null);
    }
  }

  private resetCreateForm() {
    this.createForm.set({
      title: '',
      content: '',
      tags: '',
    });
  }
}
