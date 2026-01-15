import { Component } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hair-kinetics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hair-kinetics.html',
  styleUrl: './hair-kinetics.css',
})
export class HairKinetics {
protected readonly text = UI_TEXT;
}
