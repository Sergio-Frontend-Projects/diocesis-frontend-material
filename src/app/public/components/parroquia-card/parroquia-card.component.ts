import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Parroquia } from '@core/models/parroquia.model';
import { CleanUrlPipe } from '@core/pipes/clean-url.pipe';

@Component({
  selector: 'app-parroquia-card',
  imports: [CommonModule, CleanUrlPipe],
  templateUrl: './parroquia-card.component.html',
  styleUrl: './parroquia-card.component.scss',
})
export class ParroquiaCardComponent {
  parroquia = input.required<Parroquia>();
}
