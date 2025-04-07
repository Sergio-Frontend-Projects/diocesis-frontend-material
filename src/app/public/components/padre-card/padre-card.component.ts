import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Padre } from '@core/models/padre.model';
import { CleanUrlPipe } from '@core/pipes/clean-url.pipe';
import { SocialButtonsComponent } from "@shared/components/social-buttons/social-buttons.component";

@Component({
  selector: 'app-padre-card',
  imports: [CommonModule, CleanUrlPipe, MatIconModule, SocialButtonsComponent],
  templateUrl: './padre-card.component.html',
  styleUrl: './padre-card.component.scss',
})
export class PadreCardComponent {
  padre = input.required<Padre>();
}
