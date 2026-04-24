import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { AlertService, AlertState } from '../../../services/alert.service';

@Component({
  standalone: true,
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  readonly alert$: Observable<AlertState | null>;

  constructor(private readonly alertService: AlertService) {
    this.alert$ = this.alertService.alert$;
  }

  close(): void {
    this.alertService.clear();
  }
}
