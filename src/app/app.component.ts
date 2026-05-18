import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable, filter } from 'rxjs';

import { AlertComponent } from './components/shared/alert/alert.component';
import { AuthenticatedUser } from './models/auth.model';
import { isPublicRoute } from './constants/public-routes';
import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AlertComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly isAuthenticated$: Observable<boolean>;
  readonly currentUser$: Observable<AuthenticatedUser | null>;

  constructor(private readonly authService: AuthService, private readonly router: Router) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.redirectIfUnauthenticated(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationStart => event instanceof NavigationStart))
      .subscribe((event) => this.redirectIfUnauthenticated(event.url));
  }

  private redirectIfUnauthenticated(url: string): void {
    if (!this.authService.isAuthenticated() && !isPublicRoute(url)) {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
