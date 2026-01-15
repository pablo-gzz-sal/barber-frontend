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

}
