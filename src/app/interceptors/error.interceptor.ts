import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertService } from '../services/alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private readonly alertService: AlertService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
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
      return 'No se puede eliminar porque tiene productos asociados';
    }

    if (error.status === 400) {
      if (typeof error.error === 'string' && error.error.trim().length > 0) {
        return error.error;
      }
      if (Array.isArray(error.error?.errors)) {
        return error.error.errors.join(', ');
      }
      return 'Solicitud invalida. Verifica los datos ingresados.';
    }

    return 'Ocurrio un error inesperado. Intenta nuevamente.';
  }
}
