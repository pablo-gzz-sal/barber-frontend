import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

interface FilterCategory {
  key: string;
  label: string;
}

@Component({
  selector: 'app-filter',
  imports: [CommonModule],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
})
export class Filter implements OnChanges {
  @Input() loading = false;
  @Input() page = 1;
  @Input() filters: string[] = [];
  @Input() selected = 'all';
  @Output() categoryChange = new EventEmitter<string>();

  categories: FilterCategory[] = [];
  selectedCategory = 'all';

  ngOnChanges(): void {
    this.categories = [
      { key: 'all', label: 'ALL' },
      ...this.filters.map((f) => ({ key: f, label: f.toUpperCase() })),
    ];
  }

  // selectCategory(key: string): void {
  //   this.selectedCategory = key;
  //   this.page = 1;
  //   this.categoryChange.emit(key);
  // }

  selectCategory(key: string): void {
    this.page = 1;
    this.categoryChange.emit(key);
  }
}
