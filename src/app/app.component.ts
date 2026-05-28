import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

import { AlertComponent } from './components/shared/alert/alert.component';
import { AuthenticatedUser } from './models/auth.model';
import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AlertComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly isAuthenticated$: Observable<boolean>;
  readonly currentUser$: Observable<AuthenticatedUser | null>;

  constructor(private readonly authService: AuthService, private readonly router: Router) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
