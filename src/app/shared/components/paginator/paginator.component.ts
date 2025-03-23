import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  length = input(0);
  pageSize = input(10);
  pageIndex = input(0);

  pageChange = output<PageEvent>();

  private breakpointObserver = inject(BreakpointObserver);
  isMobile = signal(false);

  constructor() {
    effect(() => {
      this.breakpointObserver
        .observe([Breakpoints.Handset])
        .subscribe((result) => {
          this.isMobile.set(result.matches);
        });
    });
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
}
