import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { CleanUrlPipe } from '../../core/pipes/clean-url.pipe';
import { Newspaper } from '../../admin/newspaper/services/newspaper';
import { Noticia } from '../../core/models/newspaper.model';
import { LucideAngularModule } from 'lucide-angular';
import { IconsService } from '../../core/services/icons.service';

@Component({
  selector: 'app-post-details',
  imports: [CommonModule, CleanUrlPipe, LucideAngularModule, RouterLink],
  templateUrl: './post-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly toastr = inject(ToastrService);
  protected readonly postsService = inject(Newspaper);
  protected readonly iconsService = inject(IconsService);

  post = signal<Noticia | null>(null);
  currentUrl = signal<string>('');

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (!param) {
      this.router.navigate(['/']);
      return;
    }

    // Si el parámetro contiene guiones, es un slug completo, extraemos el ID
    const id = param.includes('-') ? PostDetails.extractIdFromSlug(param) : param;

    this.currentUrl.set(window.location.href);

    this.postsService.getNoticiaById(id).subscribe({
      next: (data) => {
        this.post.set(data);
        this.updateMetaTags(data);
        // Actualizar la URL en el navegador con el slug sin recargar
        this.updateUrlWithSlug(data.title, id);
      },
      error: () => {
        this.router.navigate(['/']);
      },
    });
  }

  private updateUrlWithSlug(title: string, id: string): void {
    const slug = PostDetails.generateSlug(title, id);
    const url = `/noticia/${slug}`;
    window.history.replaceState({}, '', url);
    this.currentUrl.set(window.location.href);
  }

  private updateMetaTags(noticia: Noticia): void {
    // Actualizar título
    this.title.setTitle(`${noticia.title} - Diócesis de Ciudad Obregón`);

    // Meta tags básicos
    this.meta.updateTag({ name: 'description', content: this.getExcerpt(noticia.content, 160) });
    this.meta.updateTag({ name: 'keywords', content: noticia.tags.join(', ') });

    // Open Graph tags para redes sociales
    this.meta.updateTag({ property: 'og:title', content: noticia.title });
    this.meta.updateTag({
      property: 'og:description',
      content: this.getExcerpt(noticia.content, 160),
    });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:url', content: this.currentUrl() });
    if (noticia.picture) {
      this.meta.updateTag({ property: 'og:image', content: noticia.picture });
    }

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: noticia.title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: this.getExcerpt(noticia.content, 160),
    });
    if (noticia.picture) {
      this.meta.updateTag({ name: 'twitter:image', content: noticia.picture });
    }

    // Article tags
    this.meta.updateTag({ property: 'article:published_time', content: noticia.createdAt });
    this.meta.updateTag({ property: 'article:modified_time', content: noticia.updatedAt });
    noticia.tags.forEach((tag) => {
      this.meta.addTag({ property: 'article:tag', content: tag });
    });
  }

  private getExcerpt(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  }

  protected shareOnWhatsApp(): void {
    const text = `${this.post()?.title}\n${this.currentUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  protected shareOnTwitter(): void {
    const text = this.post()?.title || '';
    const url = this.currentUrl();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
    );
  }

  protected shareOnFacebook(): void {
    const url = this.currentUrl();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
    );
  }

  protected copyLink(): void {
    navigator.clipboard.writeText(this.currentUrl()).then(() => {
      this.toastr.success('Enlace copiado al portapapeles');
    });
  }

  public static generateSlug(title: string, id: string): string {
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con guiones
      .replace(/^-+|-+$/g, '') // Eliminar guiones al inicio y final
      .substring(0, 60) // Limitar longitud del slug
      .replace(/-+$/g, ''); // Eliminar guiones al final después del substring
    return `${slug}-${id}`;
  }

  public static extractIdFromSlug(slug: string): string {
    // El slug tiene formato: titulo-de-la-noticia-UUID
    // UUID formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    // Extraemos el UUID completo del final (últimos 5 segmentos separados por guiones)
    const parts = slug.split('-');
    if (parts.length >= 5) {
      // Los últimos 5 elementos forman el UUID
      return parts.slice(-5).join('-');
    }
    // Fallback: retornar el último segmento
    return parts[parts.length - 1];
  }
}
