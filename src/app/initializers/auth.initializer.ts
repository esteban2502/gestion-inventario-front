import { Router } from '@angular/router';

import { isPublicRoute } from '../constants/public-routes';
import { AuthService } from '../services/auth.service';

export function authInitializer(authService: AuthService, router: Router): () => Promise<boolean> {
  return () => {
    const path = window.location.pathname;
    const isPublic = isPublicRoute(path);

    if (!authService.isAuthenticated() && !isPublic) {
      return router.navigateByUrl('/login').then(() => false);
    }

    return Promise.resolve(true);
  };
}
