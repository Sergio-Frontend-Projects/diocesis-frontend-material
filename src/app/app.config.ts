import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { getEsPaginationIntl } from '@shared/i18n/custom-paginator-intl';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { MY_DATE_FORMATS } from '@core/constants/date.constants';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimations(),
    provideNativeDateAdapter(),
    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      newestOnTop: true,
    }),
    importProvidersFrom(BrowserAnimationsModule),
    { provide: MatPaginatorIntl, useValue: getEsPaginationIntl() },
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
};
