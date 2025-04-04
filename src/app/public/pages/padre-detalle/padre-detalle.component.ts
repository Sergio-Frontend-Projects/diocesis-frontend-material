import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Padre } from '@core/models/padre.model';
import { CleanUrlPipe } from '@core/pipes/clean-url.pipe';
import { PadreService } from '@core/services/padre.service';

@Component({
  selector: 'app-padre-detalle',
  imports: [CommonModule, CleanUrlPipe],
  templateUrl: './padre-detalle.component.html',
  styleUrl: './padre-detalle.component.scss',
})
export default class PadreDetalleComponent implements OnInit {
  route = inject(ActivatedRoute);
  padreService = inject(PadreService);

  padre = signal<Padre | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.padreService.getPadreById(id).subscribe((res) => this.padre.set(res));
  }
}
