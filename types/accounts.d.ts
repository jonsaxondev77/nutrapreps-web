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

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postCode: string;
    routeId: number;
    allergies: string;
    safePlaceDeliveryInstructions: string;
}

export type UpdateUserProfileRequest = Partial<UserProfile>;

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
