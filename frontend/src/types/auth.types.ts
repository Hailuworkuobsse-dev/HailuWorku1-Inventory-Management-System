export type UserRole = 
  | 'ADMIN' 
  | 'EXECUTIVE' 
  | 'PROJECT_MANAGER' 
  | 'STORE_KEEPER' 
  | 'PROCUREMENT_OFFICER' 
  | 'SITE_WORKER' 
  | 'SITE_ENGINEER' 
  | 'INVENTORY_MANAGER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions: string[];
  onboarded?: boolean;
  onboardingComplete?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
