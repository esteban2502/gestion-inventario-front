import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private requestsInFlight = 0;

  show(): void {
    this.requestsInFlight += 1;
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.requestsInFlight = Math.max(this.requestsInFlight - 1, 0);
    if (this.requestsInFlight === 0) {
      this.loadingSubject.next(false);
    }
  }
}
