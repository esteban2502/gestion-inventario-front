import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { AlertService } from '../../services/alert.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';

@Component({
  standalone: true,
  selector: 'app-categories',
  imports: [CommonModule, FormsModule, SpinnerComponent, ConfirmModalComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  categoryPendingDelete: Category | null = null;
  currentPage = 1;
  pageSize = 10;
  readonly pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private readonly categoryService: CategoryService,
    private readonly alertService: AlertService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  onDelete(category: Category): void {
    this.categoryPendingDelete = category;
  }

  cancelDelete(): void {
    this.categoryPendingDelete = null;
  }

  confirmDelete(): void {
    if (!this.categoryPendingDelete) {
      return;
    }

    const categoryId = this.categoryPendingDelete.id;
    this.categoryService.delete(categoryId).subscribe({
      next: () => {
        this.alertService.success('Categoria eliminada correctamente');
        this.categoryPendingDelete = null;
        this.loadCategories();
      }
    });
  }

  get totalPages(): number {
    return Math.max(Math.ceil(this.categories.length / this.pageSize), 1);
  }

  get paginatedCategories(): Category[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.categories.slice(start, start + this.pageSize);
  }

  get pageStart(): number {
    if (this.categories.length === 0) {
      return 0;
    }
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.categories.length);
  }

  goToPrevPage(): void {
    this.currentPage = Math.max(this.currentPage - 1, 1);
  }

  goToNextPage(): void {
    this.currentPage = Math.min(this.currentPage + 1, this.totalPages);
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  goToCreate(): void {
    this.router.navigate(['/categories/new']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/categories/edit', id]);
  }

  private loadCategories(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.currentPage = 1;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
