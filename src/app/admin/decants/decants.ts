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
import { ToastrService } from 'ngx-toastr';
import { IconsService } from '../../core/services/icons.service';
import { Decant } from './services/decant';
import { DecantForm, Mode } from '../../shared/models/common.models';
import { createSearchState } from '../../shared/utils/search.util';
import { createPaginationState } from '../../shared/utils/pagination.util';
import { Decanato } from '../../core/models/decant.model';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-decant',
  imports: [
    CommonModule,
    TitleComponent,
    PaginationComponent,
    EmptyState,
    ModalComponent,
    LucideAngularModule,
  ],
  templateUrl: './decants.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecantsComponent implements OnInit {
  private readonly toastrService = inject(ToastrService);
  protected readonly iconsService = inject(IconsService);
  protected readonly decantsService = inject(Decant);

  readonly confirmingToggle = signal(false);
  readonly targetDecant = signal<Decanato | null>(null);
  readonly targetAction = signal<'activate' | 'deactivate' | null>(null);
  readonly filters = signal<{ isActive?: boolean }>({});

  readonly loading = signal(false);
  readonly mode = signal<Mode>(null);
  readonly saving = signal(false);

  readonly createForm = signal<DecantForm>({
    name: '',
  });

  private readonly paginationState = createPaginationState(this.decantsService.totalDecants, {
    onChange: () => this.loadDecants(),
  });

  private readonly searchState = createSearchState({
    onSearch: () => {
      this.paginationState.resetToFirstPage();
      this.loadDecants();
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
    if (currentMode === 'create') return 'Crear Decanato';
    if (currentMode === 'edit') return 'Editar Decanato';
    return '';
  });

  readonly isCreateFormValid = computed(() => {
    const f = this.createForm();

    return f.name.trim() !== '';
  });

  readonly toggleConfirmTitle = computed(() =>
    this.targetAction() === 'activate' ? 'Activar decanato' : 'Desactivar decanato',
  );

  readonly toggleConfirmMessage = computed(() => {
    const action = this.targetAction() === 'activate' ? 'activar' : 'desactivar';
    return `¿Seguro que quieres ${action} a "${this.targetDecant()?.name}"?`;
  });

  ngOnInit(): void {
    this.loadDecants();
  }

  loadDecants() {
    this.loading.set(true);
    const { limit, offset } = this.pagination();

    this.decantsService
      .getDecanatosPaginated(offset, limit, {
        name: this.search() || undefined,
        isActive: this.filters().isActive,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.toastrService.error('Error al cargar los decanatos', 'Error');
          this.loading.set(false);
        },
      });
  }

  openCreateDecant() {
    this.mode.set('create');
    this.createForm.set({ name: '' });
  }

  openEditDecant(decant: Decanato) {
    this.mode.set('edit');
    this.targetDecant.set(decant);
    this.createForm.set({ name: decant.name });
  }

  confirmToggleDecant(decant: Decanato, action: 'activate' | 'deactivate') {
    this.targetDecant.set(decant);
    this.targetAction.set(action);
    this.confirmingToggle.set(true);
  }

  closeToggleConfirmation(): void {
    this.confirmingToggle.set(false);
    this.targetDecant.set(null);
    this.targetAction.set(null);
  }

  executeToggle(): void {
    const decant = this.targetDecant();
    const action = this.targetAction();

    if (!decant || !action) return;

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

    const payload: Partial<Decanato> = {
      name,
    };

    this.saving.set(true);

    const action =
      this.mode() === 'create'
        ? this.decantsService.createDecanato(payload)
        : this.decantsService.updateDecanato(this.targetDecant()!.id, payload);

    action.subscribe({
      next: () => {
        let msg =
          this.mode() === 'create'
            ? 'Decanato creado correctamente'
            : 'Decanato actualizado correctamente';

        this.toastrService.success(msg, 'Éxito');
        this.closeModal();
        this.loadDecants();
        this.saving.set(false);
      },
      error: () => {
        this.toastrService.error('Error al guardar el decanato', 'Error');
        this.saving.set(false);
      },
    });
  }

  changeStatus() {
    const action =
      this.targetAction() === 'activate'
        ? this.decantsService.activateDecanato(this.targetDecant()?.id!)
        : this.decantsService.deleteDecanato(this.targetDecant()?.id!);

    action
      .pipe(
        catchError((e) => {
          console.error(e);
          this.toastrService.error('Error al cambiar estado del decanato');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.toastrService.success('Decanato cambiado de estado correctamente');
        this.loadDecants();
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
    this.loadDecants();
  }

  updateCreateFormName(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.createForm.update((f) => ({ ...f, name: value }));
  }
}
