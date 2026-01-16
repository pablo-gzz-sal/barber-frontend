import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI_TEXT } from '../../constants/app-text';
import { UiButton } from '../../../shared/components/ui-button/ui-button';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, UiButton],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly text = UI_TEXT;
  isMenuOpen = false;

  content = {
    header: {
      companyName: 'JOSEPH BATTISTI',
      hours: 'Time: 9am to 9pm',
      openStatus: 'Open Now',
      btnBook: 'Book Appointment',
    },
  };

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
