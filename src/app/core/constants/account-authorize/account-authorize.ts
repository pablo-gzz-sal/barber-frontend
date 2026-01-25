import { Component, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account-authorize',
  imports: [],
  standalone: true,
  templateUrl: './account-authorize.html',
  styleUrl: './account-authorize.css',
})
export class AccountAuthorize {

    private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');

    if (!code || !state) {
      this.router.navigateByUrl('/');
      return;
    }

    window.location.href =
      `${environment.apiUrl}/customer-auth/callback` +
      `?code=${encodeURIComponent(code)}` +
      `&state=${encodeURIComponent(state)}`;
  }

}
