import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');

@NgModule({
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
})
export class AppModule {}
