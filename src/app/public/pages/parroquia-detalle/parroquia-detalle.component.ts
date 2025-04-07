import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Colonia } from '@core/models/colonia.model';
import { Decanato } from '@core/models/decanato.model';
import { Padre } from '@core/models/padre.model';
import { Parroquia } from '@core/models/parroquia.model';

import { CleanUrlPipe } from '@core/pipes/clean-url.pipe';
import { ColoniaService } from '@core/services/colonia.service';
import { DecanatoService } from '@core/services/decanato.service';
import { PadreService } from '@core/services/padre.service';
import { ParroquiaService } from '@core/services/parroquia.service';

@Component({
  selector: 'app-parroquia-detalle',
  imports: [CommonModule, CleanUrlPipe],
  templateUrl: './parroquia-detalle.component.html',
  styleUrl: './parroquia-detalle.component.scss',
})
export default class ParroquiaDetalleComponent implements OnInit {
  route = inject(ActivatedRoute);
  parroquiaService = inject(ParroquiaService);
  decanatoService = inject(DecanatoService);
  coloniaService = inject(ColoniaService);
  padreService = inject(PadreService);

  parroquia = signal<Parroquia | null>(null);
  decanato = signal<Decanato | null>(null);
  colonia = signal<Colonia | null>(null);
  padre = signal<Padre | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.parroquiaService.getParroquiaById(id).subscribe((res) => {
      this.parroquia.set(res);
      this.loadParroquiaData();
    });
  }

  loadParroquiaData() {
    this.decanatoService
      .getDecanatoById(this.parroquia()!.decanatoId!)
      .subscribe((res) => {
        this.decanato.set(res);
      });

    this.coloniaService
      .getColoniaById(this.parroquia()!.coloniaId!)
      .subscribe((res) => this.colonia.set(res));

    this.padreService
      .getPadreById(this.parroquia()!.padreId!)
      .subscribe((res) => this.padre.set(res));
  }
}
