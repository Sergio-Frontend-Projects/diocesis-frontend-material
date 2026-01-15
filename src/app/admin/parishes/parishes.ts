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
import { catchError, combineLatest, EMPTY } from 'rxjs';
import { Parroquia } from '../../core/models/parish.model';
import { CleanUrlPipe } from '../../core/pipes/clean-url.pipe';
import { IconsService } from '../../core/services/icons.service';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { ModalComponent } from '../../shared/components/modal/modal';
import { PaginationComponent } from '../../shared/components/pagination/pagination';
import { TitleComponent } from '../../shared/components/title/title';
import { Mode, ParishForm } from '../../shared/models/common.models';
import { createPaginationState } from '../../shared/utils/pagination.util';
import { createSearchState } from '../../shared/utils/search.util';
import { Colony } from '../colonies/services/colony';
import { Decant } from '../decants/services/decant';
import { Reverends } from '../reverends/services/reverends';
import { Parish } from './services/parish';

@Component({
  selector: 'app-parishes',
  imports: [
    CommonModule,
    TitleComponent,
    PaginationComponent,
    EmptyState,
    ModalComponent,
    LucideAngularModule,
    CleanUrlPipe,
  ],
  templateUrl: './parishes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParishesComponent implements OnInit {
  private readonly toastrService = inject(ToastrService);
  protected readonly iconsService = inject(IconsService);
  protected readonly coloniesService = inject(Colony);
  protected readonly decantsService = inject(Decant);
  protected readonly reverendsService = inject(Reverends);
  protected readonly parishesService = inject(Parish);
  private readonly sanitizer = inject(DomSanitizer);

  readonly confirmingToggle = signal(false);
  readonly targetParish = signal<Parroquia | null>(null);
  readonly targetAction = signal<'activate' | 'deactivate' | null>(null);
  readonly filters = signal<{ isActive?: boolean }>({});

  readonly loading = signal(false);
  readonly mode = signal<Mode>(null);
  readonly saving = signal(false);
  readonly photoPreview = signal<SafeUrl | null>(null);
  selectedFile = signal<File | null>(null);
  selectedFileName = signal<string | null>(null);

  readonly createForm = signal<ParishForm>({
    name: '',
    openingDate: '',
    address: '',
    zipCode: '',
    town: '',
    coloniaId: '',
    decanatoId: '',
    padreId: '',
  });

  private readonly paginationState = createPaginationState(this.parishesService.totalParishes, {
    onChange: () => this.loadParishes(),
  });

  private readonly searchByNameState = createSearchState({
    onSearch: () => {
      this.paginationState.resetToFirstPage();
      this.loadParishes();
    },
  });

  private readonly searchByCityState = createSearchState({
    onSearch: () => {
      this.paginationState.resetToFirstPage();
      this.loadParishes();
    },
  });

  readonly pagination = this.paginationState.pagination;
  readonly pageFrom = this.paginationState.pageFrom;
  readonly pageTo = this.paginationState.pageTo;
  readonly canPrev = this.paginationState.canPrev;
  readonly canNext = this.paginationState.canNext;

  readonly searchName = this.searchByNameState.searchTerm;
  readonly searchCity = this.searchByCityState.searchTerm;

  prevPage = () => this.paginationState.prevPage();
  nextPage = () => this.paginationState.nextPage();
  changeLimit = (e: Event) => this.paginationState.changeLimit(e);
  updateNameSearch = (e: Event) => this.searchByNameState.updateSearch(e);
  updateCitySearch = (e: Event) => this.searchByCityState.updateSearch(e);

  readonly activeFilterValue = computed(() => {
    const isActive = this.filters().isActive;
    if (isActive === undefined) return '';
    return isActive ? 'true' : 'false';
  });

  readonly modalTitle = computed(() => {
    const currentMode = this.mode();
    if (currentMode === 'create') return 'Crear Parroquia';
    if (currentMode === 'edit') return 'Editar Parroquia';
    return '';
  });

  readonly isCreateFormValid = computed(() => {
    const f = this.createForm();

    return (
      f.name.trim() !== '' &&
      f.openingDate.trim() !== '' &&
      f.address.trim() !== '' &&
      f.zipCode.trim() !== '' &&
      f.town.trim() !== '' &&
      f.coloniaId.trim() !== '' &&
      f.decanatoId.trim() !== '' &&
      f.padreId.trim() !== ''
    );
  });

  readonly toggleConfirmTitle = computed(() =>
    this.targetAction() === 'activate' ? 'Activar parroquia' : 'Desactivar parroquia',
  );

  readonly toggleConfirmMessage = computed(() => {
    const action = this.targetAction() === 'activate' ? 'activar' : 'desactivar';
    return `¿Seguro que quieres ${action} a "${this.targetParish()?.name}"?`;
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    const { limit, offset } = this.pagination();

    combineLatest([
      this.reverendsService.getAllPadres({ isActive: true }),
      this.coloniesService.getAllColonias({ isActive: true }),
      this.decantsService.getAllDecanatos({ isActive: true }),
      this.parishesService.getParroquiasPaginated(offset, limit, {
        isActive: this.filters().isActive,
      }),
    ]).subscribe({
      next: () => {
        this.loading.set(false);
      },

      error: (err) => {
        this.toastrService.error(
          'Error al cargar los datos. Por favor, intente nuevamente.',
          'Error',
        );
        this.loading.set(false);
      },
    });
  }

  loadParishes() {
    this.loading.set(true);
    const { limit, offset } = this.pagination();

    this.parishesService
      .getParroquiasPaginated(offset, limit, {
        name: this.searchName(),
        town: this.searchCity(),
        isActive: this.filters().isActive,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: (err) => {
          this.toastrService.error(
            'Error al cargar las parroquias. Por favor, intente nuevamente.',
            'Error',
          );
          this.loading.set(false);
        },
      });
  }

  openCreateParish() {
    this.mode.set('create');
    this.createForm.set({
      name: '',
      openingDate: '',
      address: '',
      zipCode: '',
      town: '',
      coloniaId: '',
      decanatoId: '',
      padreId: '',
    });
  }

  openEditParish(parish: Parroquia) {
    this.mode.set('edit');
    this.targetParish.set(parish);
    this.createForm.set({
      name: parish.name,
      openingDate: parish.openingDate,
      address: parish.address,
      zipCode: parish.zipCode,
      town: parish.town,
      coloniaId: parish.coloniaId ?? '',
      decanatoId: parish.decanatoId ?? '',
      padreId: parish.padreId ?? '',
    });
  }

  confirmToggleParish(parish: Parroquia, action: 'activate' | 'deactivate') {
    this.targetParish.set(parish);
    this.targetAction.set(action);
    this.confirmingToggle.set(true);
  }

  closeToggleConfirmation(): void {
    this.confirmingToggle.set(false);
    this.targetParish.set(null);
    this.targetAction.set(null);
  }

  executeToggle(): void {
    const parish = this.targetParish();
    const action = this.targetAction();

    if (!parish || !action) return;

    this.changeStatus();

    this.closeToggleConfirmation();
  }

  closeModal() {
    this.mode.set(null);
    this.resetCreateForm();
    this.photoPreview.set(null);
    this.selectedFile.set(null);
    this.selectedFileName.set(null);

    const photoInput = document.getElementById('photo') as HTMLInputElement | null;
    if (photoInput) {
      photoInput.value = '';
    }
  }

  save() {
    if (!this.isCreateFormValid()) {
      this.toastrService.warning('Revise la información proporcionada', 'Formulario inválido');
      return;
    }

    const { name, openingDate, address, zipCode, town, padreId, coloniaId, decanatoId } =
      this.createForm();

    const file = this.selectedFile();

    const formData = new FormData();

    formData.append('name', name);
    formData.append('openingDate', openingDate);
    formData.append('address', address);
    formData.append('zipCode', zipCode);
    formData.append('town', town);
    formData.append('coloniaId', coloniaId);
    formData.append('decanatoId', decanatoId);
    formData.append('padreId', padreId);

    if (file !== null) formData.append('picture', file);

    this.saving.set(true);

    const action =
      this.mode() === 'create'
        ? this.parishesService.createParroquia(formData)
        : this.parishesService.updateParroquia(this.targetParish()?.id!, formData);

    action.subscribe({
      next: () => {
        this.toastrService.success('Parroquia creada correctamente', 'Éxito');
        this.closeModal();
        this.loadParishes();
        this.saving.set(false);
      },
      error: () => {
        this.toastrService.error('Error al guardar parroquia', 'Error');
        this.saving.set(false);
      },
    });
  }

  changeStatus() {
    const action =
      this.targetAction() === 'activate'
        ? this.parishesService.activateParroquia(this.targetParish()?.id!)
        : this.parishesService.deleteParroquia(this.targetParish()?.id!);

    action
      .pipe(
        catchError((e) => {
          console.error(e);
          this.toastrService.error('Error al cambiar estado de la parroquia');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.toastrService.success('Parroquia cambiada de estado correctamente');
        this.loadParishes();
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
    this.loadParishes();
  }

  updateCreateFormField(field: keyof ParishForm, e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.createForm.update((f) => ({ ...f, [field]: value }));
  }

  chargeReverendRowInfo(id: string): string {
    const revenrend = this.reverendsService.reverends().find((r) => r.id === id);
    return revenrend ? `${revenrend.firstName} ${revenrend.lastName}` : 'Desconocido';
  }

  chargeDecantRowInfo(id: string): string {
    const decant = this.decantsService.decants().find((d) => d.id === id);
    return decant ? decant.name : 'Desconocido';
  }

  chargeColonyRowInfo(id: string): string {
    const colony = this.coloniesService.colonies().find((c) => c.id === id);
    return colony ? colony.name : 'Desconocido';
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
      name: '',
      openingDate: '',
      address: '',
      zipCode: '',
      town: '',
      coloniaId: '',
      decanatoId: '',
      padreId: '',
    });
  }
}
