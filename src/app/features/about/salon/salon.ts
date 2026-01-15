import { Component } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salon',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './salon.html',
  styleUrl: './salon.css',
})
export class Salon {
  protected readonly text = UI_TEXT;

}
