export type UserRole = "USER" | "ADMIN";

export interface User {
  _id: string;
  name: string;
  email: string;
  roomNumber: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

