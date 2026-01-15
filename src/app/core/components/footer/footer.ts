import { Component } from '@angular/core';
import { UI_TEXT } from '../../constants/app-text';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly text = UI_TEXT;
}
