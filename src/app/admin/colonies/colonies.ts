import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TitleComponent } from '../../shared/components/title/title';
import { PaginationComponent } from '../../shared/components/pagination/pagination';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { ModalComponent } from '../../shared/components/modal/modal';
import { LucideAngularModule } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { IconsService } from '../../core/services/icons.service';
import { Colony } from './services/colony';
import { Colonia } from '../../core/models/colony.model';
import { ColonieForm, Mode } from '../../shared/models/common.models';
import { createPaginationState } from '../../shared/utils/pagination.util';
import { createSearchState } from '../../shared/utils/search.util';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-colonie',
  imports: [
    CommonModule,
    TitleComponent,
    PaginationComponent,
    EmptyState,
    ModalComponent,
    LucideAngularModule,
  ],
  templateUrl: './colonies.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColoniesComponent {
  private readonly toastrService = inject(ToastrService);
  protected readonly iconsService = inject(IconsService);
  protected readonly coloniesService = inject(Colony);

  readonly confirmingToggle = signal(false);
  readonly targetColony = signal<Colonia | null>(null);
  readonly targetAction = signal<'activate' | 'deactivate' | null>(null);
  readonly filters = signal<{ isActive?: boolean }>({});

  readonly loading = signal(false);
  readonly mode = signal<Mode>(null);
  readonly saving = signal(false);

  readonly createForm = signal<ColonieForm>({
    name: '',
  });

  private readonly paginationState = createPaginationState(this.coloniesService.totalColonies, {
    onChange: () => this.loadColonies(),
  });

  private readonly searchState = createSearchState({
    onSearch: () => {
      this.paginationState.resetToFirstPage();
      this.loadColonies();
    },
  });

  readonly pagination = this.paginationState.pagination;
  readonly pageFrom = this.paginationState.pageFrom;
  readonly pageTo = this.paginationState.pageTo;
  readonly canPrev = this.paginationState.canPrev;
  readonly canNext = this.paginationState.canNext;

  readonly search = this.searchState.searchTerm;

  prevPage = () => this.paginationState.prevPage();
  nextPage = () => this.paginationState.nextPage();
  changeLimit = (e: Event) => this.paginationState.changeLimit(e);
  updateSearch = (e: Event) => this.searchState.updateSearch(e);

  readonly activeFilterValue = computed(() => {
    const isActive = this.filters().isActive;
    if (isActive === undefined) return '';
    return isActive ? 'true' : 'false';
  });

  readonly modalTitle = computed(() => {
    const currentMode = this.mode();
    if (currentMode === 'create') return 'Crear Colonia';
    if (currentMode === 'edit') return 'Editar Colonia';
    return '';
  });

  readonly isCreateFormValid = computed(() => {
    const f = this.createForm();

    return f.name.trim() !== '';
  });

  readonly toggleConfirmTitle = computed(() =>
    this.targetAction() === 'activate' ? 'Activar colonia' : 'Desactivar colonia',
  );

  readonly toggleConfirmMessage = computed(() => {
    const action = this.targetAction() === 'activate' ? 'activar' : 'desactivar';
    return `¿Seguro que quieres ${action} a "${this.targetColony()?.name}"?`;
  });

  ngOnInit(): void {
    this.loadColonies();
  }

  loadColonies() {
    this.loading.set(true);
    const { limit, offset } = this.pagination();

    this.coloniesService
      .getColoniasPaginated(offset, limit, {
        name: this.search() || undefined,
        isActive: this.filters().isActive,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.toastrService.error('Error al cargar las colonias', 'Error');
          this.loading.set(false);
        },
      });
  }

  openCreateColony() {
    this.mode.set('create');
    this.createForm.set({ name: '' });
  }

  openEditColony(colony: Colonia) {
    this.mode.set('edit');
    this.targetColony.set(colony);
    this.createForm.set({ name: colony.name });
  }

  confirmToggleColony(colony: Colonia, action: 'activate' | 'deactivate') {
    this.targetColony.set(colony);
    this.targetAction.set(action);
    this.confirmingToggle.set(true);
  }

  closeToggleConfirmation(): void {
    this.confirmingToggle.set(false);
    this.targetColony.set(null);
    this.targetAction.set(null);
  }

  executeToggle(): void {
    const colony = this.targetColony();
    const action = this.targetAction();

    if (!colony || !action) return;

    this.changeStatus();

    this.closeToggleConfirmation();
  }

  closeModal() {
    this.mode.set(null);
    this.createForm.set({ name: '' });
  }

  save() {
    if (!this.isCreateFormValid()) {
      this.toastrService.warning('Revise la información proporcionada', 'Formulario inválido');
      return;
    }

    const { name } = this.createForm();

    const payload: Partial<Colonia> = {
      name,
    };

    this.saving.set(true);

    const action =
      this.mode() === 'create'
        ? this.coloniesService.createColonia(payload)
        : this.coloniesService.updateColonia(this.targetColony()!.id, payload);

    action.subscribe({
      next: () => {
        let msg =
          this.mode() === 'create'
            ? 'Colonia creada correctamente'
            : 'Colonia actualizada correctamente';

        this.toastrService.success(msg, 'Éxito');
        this.closeModal();
        this.loadColonies();
        this.saving.set(false);
      },
      error: () => {
        this.toastrService.error('Error al guardar la colonia', 'Error');
        this.saving.set(false);
      },
    });
  }

  changeStatus() {
    const action =
      this.targetAction() === 'activate'
        ? this.coloniesService.activateColonia(this.targetColony()?.id!)
        : this.coloniesService.deleteColonia(this.targetColony()?.id!);

    action
      .pipe(
        catchError((e) => {
          console.error(e);
          this.toastrService.error('Error al cambiar estado de la colonia');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.toastrService.success('Colonia cambiada de estado correctamente');
        this.loadColonies();
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
    this.loadColonies();
  }

  updateCreateFormName(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.createForm.update((f) => ({ ...f, name: value }));
  }
}
