import { Component } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews {
  protected readonly text = UI_TEXT;

}
