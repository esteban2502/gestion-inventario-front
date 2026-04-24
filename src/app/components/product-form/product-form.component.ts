import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { AlertService } from '../../services/alert.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

const NAME_PATTERN = /^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9\s.,\-()]{2,99}$/;
const DESCRIPTION_PATTERN = /^$|^[A-Za-zÀ-ÿ0-9\s.,\-()]{3,300}$/;

@Component({
  standalone: true,
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  submitting = false;
  editingId: number | null = null;

  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly alertService: AlertService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(NAME_PATTERN)]],
      description: ['', [Validators.pattern(DESCRIPTION_PATTERN)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.editingId = id ? Number(id) : null;
    this.loadCategories();
    if (this.editingId) {
      this.loadProduct(this.editingId);
      return;
    }
    this.loading = false;
  }

  get isEditMode(): boolean {
    return this.editingId !== null;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      name: this.sanitizeText(raw.name),
      description: this.sanitizeText(raw.description)
    };

    const request = this.isEditMode
      ? this.productService.update(this.editingId as number, payload)
      : this.productService.create(payload);

    request.subscribe({
      next: () => {
        this.alertService.success(this.isEditMode ? 'Producto actualizado' : 'Producto creado');
        this.submitting = false;
        this.router.navigate(['/products']);
      },
      error: () => {
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  private loadProduct(id: number): void {
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private sanitizeText(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }
}
