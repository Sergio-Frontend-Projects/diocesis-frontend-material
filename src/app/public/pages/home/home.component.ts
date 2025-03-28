import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarruselComponent } from '@public/components/carrusel/carrusel.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarruselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {}
