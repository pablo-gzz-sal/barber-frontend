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

  content = {
    features: [
      {
        title: 'Extensions',
        desc: 'Premium, seamless extensions that add fullness, length, and effortless movement to your hair.',
      },
      {
        title: 'Treatments',
        desc: 'Advanced chemical treatments that deliver long-lasting shine, smoothness, and healthy, refined texture.',
      },
      {
        title: 'Color',
        desc: 'Dimensional, customized color designed to enhance your features and elevate your natural beauty.',
      },
      {
        title: 'Cutting',
        desc: 'Precision cutting that creates sharp, clean, and beautifully balanced shapes tailored to you.',
      },
    ],
  };

  getIcon(index: number): string {
    const icons = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>',
    ];
    return icons[index] || icons[0];
  }
}
