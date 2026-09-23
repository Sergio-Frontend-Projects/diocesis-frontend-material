import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { Isma } from './isma';
import { IsmaInformationService } from '../../admin/isma-information/services/isma-information';
import { IsmaInformacion } from '../../core/models/isma-information.model';

const row: IsmaInformacion = {
  id: '00000000-0000-0000-0000-000000000002',
  introduccion: 'Introduccion de ISMA.',
  documentacionNecesaria: 'Documentacion necesaria de ISMA.',
  parroquiaCorrespondiente: 'Parroquia correspondiente de ISMA.',
  entrevistaParroco: 'Entrevista con el parroco.',
  programaIsma: 'Programa de ISMA.',
  tiemposAnticipacion: 'Tiempos de anticipacion.',
  contactoTelefono1: '6444151646',
  contactoTelefono2: '6444132098',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  updatedBy: null,
};

describe('Isma (pagina publica)', () => {
  let fixture: ComponentFixture<Isma>;
  let serviceStub: jasmine.SpyObj<IsmaInformationService>;

  beforeEach(async () => {
    serviceStub = jasmine.createSpyObj<IsmaInformationService>('IsmaInformationService', [
      'getInformation',
    ]);
    serviceStub.getInformation.and.returnValue(of(row));

    await TestBed.configureTestingModule({
      imports: [Isma],
      providers: [
        provideZonelessChangeDetection(),
        { provide: IsmaInformationService, useValue: serviceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Isma);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('carga y muestra las secciones informativas', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Introduccion de ISMA.');
    expect(text).toContain('Documentacion necesaria de ISMA.');
    expect(text).toContain('Programa de ISMA.');
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('muestra los telefonos de contacto como enlaces', () => {
    const el: HTMLElement = fixture.nativeElement;
    const telLinks = el.querySelectorAll('a[href^="tel:"]');
    expect(telLinks.length).toBe(2);
    expect(telLinks[0].textContent?.trim()).toBe('6444151646');
    expect(telLinks[1].textContent?.trim()).toBe('6444132098');
  });
});
