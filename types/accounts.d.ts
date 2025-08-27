export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  firstName?: string; // Nullable in C# maps to optional in TypeScript
  lastName?: string;
  email?: string;
  jwtToken?: string;
  refreshToken?: string;
  expiresIn: number;
  role: string;
  message: string;
}