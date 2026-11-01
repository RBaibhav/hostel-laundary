import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];
    const message = firstIssue
      ? `${firstIssue.path.join(".") || "field"}: ${firstIssue.message}`
      : "Invalid request payload";

    res.status(400).json({
      success: false,
      message,
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  const error = err as { name?: string; message?: string; code?: number };
  let statusCode = 500;
  let message = "Something went wrong";

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "That value already exists";
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    message = error.message || "Validation failed";
  } else if (process.env.NODE_ENV !== "production" && error.message) {
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};
