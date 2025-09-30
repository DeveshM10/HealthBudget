import { Request, Response, NextFunction, RequestHandler } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from '../utils/error.js';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        const formattedErrors: Record<string, string[]> = {};
        
        result.error.errors.forEach((error) => {
          const path = error.path.join('.');
          if (!formattedErrors[path]) {
            formattedErrors[path] = [];
          }
          formattedErrors[path].push(error.message);
        });
        
        throw new ValidationError(formattedErrors);
      }

      // Replace the request with validated data
      req.body = result.data.body || {};
      req.query = result.data.query || {};
      req.params = result.data.params || {};
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateRequest = validate;
