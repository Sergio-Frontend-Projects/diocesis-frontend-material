import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FilterConfig } from '../../../core/models/filter-config.model';

@Component({
  selector: 'app-filter-bar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent implements OnInit {
  fb = inject(FormBuilder);

  filters = input<FilterConfig[]>([]);

  search = output<Record<string, any>>();
  clear = output<void>();

  form = this.fb.group({});

  ngOnInit(): void {
    for (const filter of this.filters()) {
      this.form.addControl(filter.key, this.fb.control(null));
    }
  }

  onSearch() {
    this.search.emit(this.form.value);
  }

  onClear() {
    this.form.reset();
    this.clear.emit();
  }
}
