import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarruselComponent } from '@public/components/carrusel/carrusel.component';
import { NoticiasComponent } from '@public/components/noticias/noticias.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarruselComponent, NoticiasComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {}
