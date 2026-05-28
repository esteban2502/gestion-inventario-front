export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthenticatedUser;
}

export interface AuthSession {
  accessToken: string;
  user: AuthenticatedUser;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface MessageResponse {
  message: string;
}
