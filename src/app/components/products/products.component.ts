import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { AlertService } from '../../services/alert.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [CommonModule, FormsModule, SpinnerComponent, ConfirmModalComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId = '';
  loading = true;
  productPendingDelete: Product | null = null;
  currentPage = 1;
  pageSize = 10;
  readonly pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly alertService: AlertService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts(categoryId?: number): void {
    this.loading = true;
    this.productService.getByCategory(categoryId).subscribe({
      next: (data) => {
        this.products = data;
        this.currentPage = 1;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    const categoryId = this.selectedCategoryId ? Number(this.selectedCategoryId) : undefined;
    this.loadProducts(categoryId);
  }

  onDelete(product: Product): void {
    this.productPendingDelete = product;
  }

  cancelDelete(): void {
    this.productPendingDelete = null;
  }

  confirmDelete(): void {
    if (!this.productPendingDelete) {
      return;
    }

    const productId = this.productPendingDelete.id;
    this.productService.delete(productId).subscribe({
      next: () => {
        this.alertService.success('Producto eliminado correctamente');
        this.productPendingDelete = null;
        this.onFilterChange();
      }
    });
  }

  get totalPages(): number {
    return Math.max(Math.ceil(this.products.length / this.pageSize), 1);
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.products.slice(start, start + this.pageSize);
  }

  get pageStart(): number {
    if (this.products.length === 0) {
      return 0;
    }
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.products.length);
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
    this.router.navigate(['/products/new']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      }
    });
  }
}
