import { Component, OnInit } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IS_BROWSER } from '../../../core/platform';

@Component({
  selector: 'app-artist',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './artist.html',
  styleUrl: './artist.css',
})
export class Artist implements OnInit {
  protected readonly text = UI_TEXT;
  content = {
    label: 'THE ARTIST',
    bio: 'Learn more about his award winning method and approach to hair.',
    btnText: 'Learn More',
  };

  ngOnInit() {
    if (IS_BROWSER) window.scrollTo(0, 0);
  }
}
