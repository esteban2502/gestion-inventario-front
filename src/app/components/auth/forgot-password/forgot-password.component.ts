import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../login/login.component.css', '../auth-shared.css']
})
export class ForgotPasswordComponent {
  submitting = false;
  requestSent = false;

  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly alertService: AlertService
  ) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.authService.forgotPassword(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.requestSent = true;
        this.submitting = false;
        this.alertService.success(response.message);
      },
      error: () => {
        this.submitting = false;
      }
    });
  }
}
