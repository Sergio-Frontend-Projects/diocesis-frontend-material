import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { Noticia } from '@core/models/noticia.model';
import { CleanUrlPipe } from '@core/pipes/clean-url.pipe';
import { NoticiaService } from '@core/services/noticia.service';

@Component({
  selector: 'app-noticia-detalle',
  imports: [CommonModule, MatChipsModule, CleanUrlPipe],
  templateUrl: './noticia-detalle.component.html',
  styleUrl: './noticia-detalle.component.scss',
})
export default class NoticiaDetalleComponent implements OnInit {
  route = inject(ActivatedRoute);
  noticiaService = inject(NoticiaService);

  noticia = signal<Noticia | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.noticiaService
      .getNoticiaById(id)
      .subscribe((data) => this.noticia.set(data));
  }
}
