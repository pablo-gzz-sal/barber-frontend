import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
})
export class UiButton {
  @Input() label: string = '';
  @Input() customClass: string = 'border-white/20 text-white';
}
