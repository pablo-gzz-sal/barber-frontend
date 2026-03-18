import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './shared/components/toast/toast';
import { SearchOverlay } from './features/search-overlay/search-overlay';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, SearchOverlay],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
  
})
export class App {
  protected readonly title = signal('barber-frontend');
}
