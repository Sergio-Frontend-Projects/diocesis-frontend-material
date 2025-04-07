import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-social-buttons',
  imports: [CommonModule],
  templateUrl: './social-buttons.component.html',
  styleUrl: './social-buttons.component.scss',
})
export class SocialButtonsComponent {
  email = input('');
  facebook = input('');
  twitter = input('');
  instagram = input('');
}
