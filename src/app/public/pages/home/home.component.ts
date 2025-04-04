import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarruselComponent } from '@public/components/carrusel/carrusel.component';
import { NoticiasComponent } from '@public/components/noticias/noticias.component';
import { BuscadorCardComponent } from '../../components/buscador-card/buscador-card.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    CarruselComponent,
    NoticiasComponent,
    BuscadorCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {}
