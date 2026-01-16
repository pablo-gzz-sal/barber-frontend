import { Component } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-treatments-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './treatments-hero.html',
  styleUrl: './treatments-hero.css',
})
export class TreatmentsHero {
protected readonly text = UI_TEXT;
 content = {
    activeTab: 'treatments',
    tabs: [
      { id: 'extensions', number: '01', label: 'EXTENSIONS' },
      { id: 'treatments', number: '02', label: 'TREATMENTS' },
      { id: 'color', number: '03', label: 'COLOR' }
    ]
  };
}
