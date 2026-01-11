import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './search-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchCardComponent {
  title = input.required<string>();
  description = input<string>('');
  iconPath = input.required<string>();
  buttonText = input<string>('IR AL BUSCADOR');
  routerLink = input<string>();
}
