import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../models/User";

interface DecodedToken {
  userId: string;
  role: UserRole;
  email?: string;
  iat?: number;
  exp?: number;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication required. Please provide a Bearer token in the Authorization header"
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication token is missing"
      });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({
        success: false,
        message: "Server configuration error: JWT_SECRET not found"
      });
      return;
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, secret, {
        algorithms: ["HS256"]
      }) as DecodedToken;
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          success: false,
          message: "Authentication token has expired. Please log in again"
        });
        return;
      }
      res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "User associated with this token no longer exists"
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    next(error);
  }
};
