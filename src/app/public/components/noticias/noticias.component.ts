import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Noticia } from '@core/models/noticia.model';
import { CleanUrlPipe } from '@core/pipes/clean-url.pipe';
import { NoticiaService } from '@core/services/noticia.service';
import { NgxSplideComponent, NgxSplideModule } from 'ngx-splide';
import type { Splide } from '@splidejs/splide';

@Component({
  selector: 'app-noticias',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    CleanUrlPipe,
    NgxSplideModule,
  ],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.scss',
})
export class NoticiasComponent implements OnInit {
  private noticiaService = inject(NoticiaService);
  noticias = signal<Noticia[]>([]);

  ngOnInit(): void {
    this.noticiaService.getNoticiasPaginated(0, 10).subscribe((res) => {
      this.noticias.set(res.results.filter((n) => n.isActive));
    });
  }

  shortContent(content: string): string {
    return content.length > 100 ? content.slice(0, 100) + '...' : content;
  }
}
