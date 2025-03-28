import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Banner } from '@core/models/banner.model';
import { BannerService } from '@core/services/banner.service';

@Component({
  selector: 'app-carrusel',
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarruselComponent implements OnInit {
  private carruselService = inject(BannerService);
  banners = signal<Banner[]>([]);

  ngOnInit(): void {
    this.carruselService.getAll().subscribe((data) => this.banners.set(data));
  }
}
