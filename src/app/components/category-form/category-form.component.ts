import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoryService } from '../../services/category.service';
import { AlertService } from '../../services/alert.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

const NAME_PATTERN = /^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9\s.,\-()]{2,99}$/;
const DESCRIPTION_PATTERN = /^$|^[A-Za-zÀ-ÿ0-9\s.,\-()]{3,300}$/;

@Component({
  standalone: true,
  selector: 'app-category-form',
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  loading = true;
  submitting = false;
  editingId: number | null = null;

  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly categoryService: CategoryService,
    private readonly alertService: AlertService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(NAME_PATTERN)]],
      description: ['', [Validators.pattern(DESCRIPTION_PATTERN)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.editingId = id ? Number(id) : null;
    if (this.editingId) {
      this.loadCategory(this.editingId);
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
      ? this.categoryService.update(this.editingId as number, payload)
      : this.categoryService.create(payload);

    request.subscribe({
      next: () => {
        this.alertService.success(this.isEditMode ? 'Categoria actualizada' : 'Categoria creada');
        this.submitting = false;
        this.router.navigate(['/categories']);
      },
      error: () => {
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }

  private loadCategory(id: number): void {
    this.categoryService.getById(id).subscribe({
      next: (category) => {
        this.form.patchValue({
          name: category.name,
          description: category.description
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
