import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { isPublicRoute } from '../constants/public-routes';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly alertService: AlertService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 401
          && !req.url.includes('/auth/login')
          && !req.url.includes('/auth/register')
          && !req.url.includes('/auth/forgot-password')
          && !req.url.includes('/auth/reset-password')
        ) {
          this.authService.logout();
          const routePath = this.router.url.split('?')[0];
          if (!isPublicRoute(routePath, this.router.url.includes('?') ? this.router.url.slice(this.router.url.indexOf('?')) : '')) {
            this.router.navigate(['/login']);
          }
        }

        const message = this.buildErrorMessage(error);
        this.alertService.error(message);
        return throwError(() => error);
      })
    );
  }

  private buildErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 404) {
      return 'Recurso no encontrado';
    }

    if (error.status === 409) {
      const message = typeof error.error?.error === 'string' ? error.error.error : '';
      if (message.toLowerCase().includes('email')) {
        return 'Este correo ya esta registrado';
      }
      return 'No se puede eliminar porque tiene productos asociados';
    }

    if (error.status === 401) {
      const message = typeof error.error?.error === 'string' ? error.error.error : '';
      if (message.toLowerCase().includes('invalid')) {
        return 'Correo o contraseña incorrectos';
      }
      return 'Sesion invalida. Inicie sesion nuevamente.';
    }

    if (error.status === 403) {
      return 'Sin permisos para realizar esta accion';
    }

    if (error.status === 400) {
      const message = typeof error.error?.error === 'string' ? error.error.error : '';
      if (message.toLowerCase().includes('reset token')) {
        return 'El enlace de restablecimiento es invalido o ha expirado. Solicita uno nuevo.';
      }
      if (typeof error.error === 'string' && error.error.trim().length > 0) {
        return error.error;
      }
      if (Array.isArray(error.error?.errors)) {
        return error.error.errors.join(', ');
      }
      return 'Solicitud invalida. Verifique los datos ingresados.';
    }

    return 'Ocurrio un error inesperado. Intente nuevamente.';
  }
}
