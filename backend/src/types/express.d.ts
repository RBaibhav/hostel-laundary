import { UserRole } from "../models/User";

export interface AuthUser {
  id: string;
  role: UserRole;
  email?: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

