import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardSummary } from '../../models/dashboard-summary.model';
import { DashboardService } from '../../services/dashboard.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  loading = true;

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (response) => {
        this.summary = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  entries(): [string, number][] {
    return this.summary ? Object.entries(this.summary.productsPerCategory) : [];
  }
}
