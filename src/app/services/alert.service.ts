import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AlertType = 'success' | 'danger' | 'warning' | 'info';

export interface AlertState {
  type: AlertType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly alertSubject = new BehaviorSubject<AlertState | null>(null);
  readonly alert$ = this.alertSubject.asObservable();
  private clearTimeoutId: ReturnType<typeof setTimeout> | null = null;

  show(type: AlertType, message: string): void {
    if (this.clearTimeoutId) {
      clearTimeout(this.clearTimeoutId);
    }

    this.alertSubject.next({ type, message });
    this.clearTimeoutId = setTimeout(() => {
      this.clear();
    }, 3500);
  }

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('danger', message);
  }

  clear(): void {
    if (this.clearTimeoutId) {
      clearTimeout(this.clearTimeoutId);
      this.clearTimeoutId = null;
    }
    this.alertSubject.next(null);
  }
}
