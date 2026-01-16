import { Component } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';
import { UiButton } from '../../../shared/components/ui-button/ui-button';

@Component({
  selector: 'app-artist',
  imports: [CommonModule, UiButton],
  standalone: true,
  templateUrl: './artist.html',
  styleUrl: './artist.css',
})
export class Artist {
  protected readonly text = UI_TEXT;
    content = {
    label: 'THE ARTIST',
    bio: 'Learn more about his award winning method and approach to hair.',
    btnText: 'Learn More'
  };  
}
