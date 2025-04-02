import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanUrl',
})
export class CleanUrlPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const httpsIndex = value.indexOf('https://');

    return httpsIndex !== -1 ? value.slice(httpsIndex) : value;
  }
}
