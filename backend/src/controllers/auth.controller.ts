import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { generateToken } from "../utils/generateToken";
import { ApiError } from "../utils/ApiError";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, roomNumber } = req.body;

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      throw new ApiError(409, "A user with this email already exists");
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      roomNumber,
      role: "USER"
    });

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          roomNumber: user.roomNumber,
          role: user.role,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          roomNumber: user.roomNumber,
          role: user.role,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};
