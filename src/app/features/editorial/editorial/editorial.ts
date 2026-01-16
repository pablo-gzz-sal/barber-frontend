import { Component } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editorial',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './editorial.html',
  styleUrl: './editorial.css',
})
export class Editorial {
  protected readonly text = UI_TEXT;
    content = {
    title: ['WHERE', 'PRECISION', 'MEETS', 'FLOW'],
    tag: 'NEW',
    caption: 'Precision cutting for sharp, clean and professional-looking hairstyles.'
  }

}
