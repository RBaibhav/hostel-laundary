import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params) as Record<string, string>;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
};
