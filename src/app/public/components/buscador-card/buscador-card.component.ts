import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-buscador-card',
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './buscador-card.component.html',
  styleUrl: './buscador-card.component.scss',
})
export class BuscadorCardComponent {
  title = input('Titulo');
  imageUrl = input('x');
  link = input('x');
}
