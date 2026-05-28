import { Router } from '@angular/router';

import {
  extractResetTokenFromUrl,
  isPublicRoute,
  normalizeRoutePath
} from '../constants/public-routes';
import { AuthService } from '../services/auth.service';

export function authInitializer(authService: AuthService, router: Router): () => Promise<boolean> {
  return () => {
    const path = normalizeRoutePath(window.location.pathname);
    const search = window.location.search;
    const resetToken = extractResetTokenFromUrl(path, search);

    if (resetToken && !path.startsWith('/reset-password/')) {
      return router.navigateByUrl(`/reset-password/${resetToken}`, { replaceUrl: true }).then(() => true);
    }

    if (!authService.isAuthenticated() && !isPublicRoute(path, search)) {
      return router.navigateByUrl('/login', { replaceUrl: true }).then(() => false);
    }

    return Promise.resolve(true);
  };
}
