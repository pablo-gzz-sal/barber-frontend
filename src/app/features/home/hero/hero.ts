import { Component } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';

@Component({
  selector: 'app-hero',
  imports: [],
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly text = UI_TEXT;

}
