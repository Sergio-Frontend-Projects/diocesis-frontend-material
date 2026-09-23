import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { Institute } from './institute';
import { InstituteInformationService } from '../../admin/institute-information/services/institute-information';
import { InstitutoInformacion } from '../../core/models/institute-information.model';

const row: InstitutoInformacion = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Instituto Biblico — Instituto del Sagrado Corazón de Jesús',
  description: 'Formacion biblica para toda la Diocesis.',
  contactEmail: 'instituto@example.test',
  contactPhone: '6444151646',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  updatedBy: null,
};

describe('Institute (pagina publica)', () => {
  let fixture: ComponentFixture<Institute>;
  let serviceStub: jasmine.SpyObj<InstituteInformationService>;

  beforeEach(async () => {
    serviceStub = jasmine.createSpyObj<InstituteInformationService>(
      'InstituteInformationService',
      ['getInformation'],
    );
    serviceStub.getInformation.and.returnValue(of(row));

    await TestBed.configureTestingModule({
      imports: [Institute],
      providers: [
        provideZonelessChangeDetection(),
        { provide: InstituteInformationService, useValue: serviceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Institute);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('carga y muestra el nombre/descripcion publicos', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Instituto Biblico');
    expect(text).toContain('Formacion biblica para toda la Diocesis.');
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('muestra el correo y telefono de contacto como enlaces', () => {
    const el: HTMLElement = fixture.nativeElement;
    const mailLink = el.querySelector('a[href^="mailto:"]');
    const telLink = el.querySelector('a[href^="tel:"]');
    expect(mailLink?.textContent?.trim()).toBe('instituto@example.test');
    expect(telLink?.textContent?.trim()).toBe('6444151646');
  });
});
