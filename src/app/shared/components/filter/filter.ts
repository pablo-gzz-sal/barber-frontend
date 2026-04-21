import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

type CategoryKey = 'all' | 'shampoo' | 'conditioner' | 'styling';

@Component({
  selector: 'app-filter',
  imports: [CommonModule],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
})
export class Filter {
  @Input() loading = false;
  @Input() page = 1;
  @Output() categoryChange = new EventEmitter<CategoryKey>();

  categories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: 'ALL' },
    { key: 'shampoo', label: 'SHAMPOO' },
    { key: 'conditioner', label: 'CONDITIONER' },
    { key: 'styling', label: 'STYLING' },
  ];

  selectedCategory: CategoryKey = 'all';

  selectCategory(key: CategoryKey): void {
    this.selectedCategory = key;
    this.page = 1;
    this.categoryChange.emit(key);
  }
}