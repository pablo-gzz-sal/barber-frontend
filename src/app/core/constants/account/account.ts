import { Component, inject } from '@angular/core';
import { CustomerService } from '../../services/customer-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  private customer = inject(CustomerService);

  loading = true;
  me: any = null;

  ngOnInit() {
    this.customer.me().subscribe({
      next: (res) => {
        this.me = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  login() {
    this.customer.login();
  }

  logout() {
    this.customer.logout();
  }
}
