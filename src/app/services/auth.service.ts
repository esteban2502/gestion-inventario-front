import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  AuthResponse,
  AuthSession,
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest
} from '../models/auth.model';

const AUTH_SESSION_KEY = 'auth_session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly sessionSubject = new BehaviorSubject<AuthSession | null>(this.readSessionFromStorage());

  readonly session$ = this.sessionSubject.asObservable();
  readonly currentUser$ = this.session$.pipe(map((session) => session?.user ?? null));
  readonly isAuthenticated$ = this.session$.pipe(map((session) => session !== null));

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/forgot-password`, payload);
  }

  resetPassword(payload: ResetPasswordRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/reset-password`, payload);
  }

  logout(): void {
    localStorage.removeItem(AUTH_SESSION_KEY);
    this.sessionSubject.next(null);
  }

  getToken(): string | null {
    return this.sessionSubject.value?.accessToken ?? null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  private saveSession(response: AuthResponse): void {
    const session: AuthSession = {
      accessToken: response.accessToken,
      user: response.user
    };
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    this.sessionSubject.next(session);
  }

  private readSessionFromStorage(): AuthSession | null {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      localStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }
  }
}
