import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { extractResetTokenFromUrl } from '../../../constants/public-routes';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['../login/login.component.css', '../register/register.component.css', '../auth-shared.css']
})
export class ResetPasswordComponent implements OnInit {
  submitting = false;
  showPassword = false;
  showConfirmPassword = false;
  token = '';
  invalidLink = false;
  private warnedInvalidLink = false;

  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly alertService: AlertService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: [this.passwordsMatchValidator()]
    });
  }

  ngOnInit(): void {
    this.resolveTokenFromRoute();

    this.route.paramMap.subscribe(() => this.resolveTokenFromRoute());
    this.route.queryParamMap.subscribe(() => this.resolveTokenFromRoute());
  }

  submit(): void {
    if (!this.token || this.invalidLink) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const { password } = this.form.getRawValue();
    this.authService.resetPassword({ token: this.token, password }).subscribe({
      next: (response) => {
        this.alertService.success(response.message);
        this.submitting = false;
        void this.router.navigate(['/login']);
      },
      error: () => {
        this.submitting = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private resolveTokenFromRoute(): void {
    const paramToken = this.route.snapshot.paramMap.get('token');
    const queryToken = this.route.snapshot.queryParamMap.get('token');
    const urlToken = extractResetTokenFromUrl(
      window.location.pathname,
      window.location.search
    );

    this.token = (paramToken ?? queryToken ?? urlToken ?? '').trim();
    this.invalidLink = !this.token;

    if (this.invalidLink && !this.warnedInvalidLink) {
      this.warnedInvalidLink = true;
      this.alertService.show(
        'warning',
        'El enlace no es valido o expiro. Solicita uno nuevo desde recuperar contraseña.'
      );
    }
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      if (!password || !confirmPassword) {
        return null;
      }
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }
}
