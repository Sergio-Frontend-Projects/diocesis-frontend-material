import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Banner } from '@core/models/banner.model';
import { BannerService } from '@core/services/banner.service';
import { NgxSplideComponent, NgxSplideModule } from 'ngx-splide';
import type { Splide } from '@splidejs/splide';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule, MatIconModule, NgxSplideModule],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.scss',
})
export class CarruselComponent implements OnInit, AfterViewInit {
  private bannerService = inject(BannerService);
  private playButtonTimeout?: ReturnType<typeof setTimeout>;

  banners = signal<Banner[]>([]);
  showPlayButton = signal(true);

  splideRef = viewChild.required<NgxSplideComponent>('splideRef');
  splideInstance?: Splide;

  ngOnInit(): void {
    this.bannerService.getAll().subscribe((data) => this.banners.set(data));
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.splideInstance = (this.splideRef() as any).splide as Splide;
    });
  }

  toggleVideo(video: HTMLVideoElement) {
    if (!this.splideInstance) return;

    if (video.paused) {
      video.play();
      this.splideInstance.Components.Autoplay.pause();
    } else {
      video.pause();
      this.splideInstance.Components.Autoplay.play();
    }

    this.onUserInteracts();
  }

  handleVideoPlay() {
    this.splideInstance?.Components.Autoplay.pause();
  }

  handleVideoPause() {
    this.splideInstance?.Components.Autoplay.play();
  }

  onUserInteracts() {
    this.showPlayButton.set(true);

    if (this.playButtonTimeout) clearTimeout(this.playButtonTimeout);

    this.playButtonTimeout = setTimeout(() => {
      this.showPlayButton.set(false);
    }, 3000);
  }
}
