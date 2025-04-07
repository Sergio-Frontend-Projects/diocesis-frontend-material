import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Noticia } from '@core/models/noticia.model';
import { CleanUrlPipe } from '@core/pipes/clean-url.pipe';
import { NoticiaService } from '@core/services/noticia.service';
import { NgxSplideModule } from 'ngx-splide';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-noticias',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    CleanUrlPipe,
    NgxSplideModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.scss',
})
export class NoticiasComponent implements OnInit {
  private noticiaService = inject(NoticiaService);
  noticias = signal<Noticia[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.noticiaService.getNoticiasPaginated(0, 10).subscribe({
      next: (res) => {
        this.noticias.set(res.results.filter((n) => n.isActive));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false); // ocultar aunque haya error
      },
    });
  }

  shortContent(content: string): string {
    return content.length > 100 ? content.slice(0, 100) + '...' : content;
  }
}
