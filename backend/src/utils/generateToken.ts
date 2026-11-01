import jwt, { SignOptions } from "jsonwebtoken";
import { UserRole } from "../models/User";

export interface TokenPayload {
  userId: string;
  role: UserRole;
  email?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured in environment variables");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  const options: SignOptions = {
    // Cast expiresIn as any to satisfy TypeScript with jsonwebtoken SignOptions
    expiresIn: expiresIn as unknown as NonNullable<SignOptions["expiresIn"]>,
    algorithm: "HS256"
  };

  return jwt.sign(payload, secret, options);
};

