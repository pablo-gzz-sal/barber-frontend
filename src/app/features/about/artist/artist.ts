import { Component, OnInit } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artist',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './artist.html',
  styleUrl: './artist.css',
})
export class Artist implements OnInit {
  protected readonly text = UI_TEXT;
  constructor(private router: Router) {}
  content = {
    label: 'THE ARTIST',
    bio: 'Learn more about his award winning method and approach to hair.',
    btnText: 'Learn More',
  };

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  onAbout() {
    this.router.navigate(['/about']);
  }

  onShop() {
    this.router.navigate(['/shop']);
  }
}
