import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';

// Validation middleware factory
export const validateSchema = (schema: {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      // Validate request parameters
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      // Validate query parameters
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      // Handle other errors
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
    }
  };
};

// Body validation middleware
export const validateBody = (schema: ZodSchema) => {
  return validateSchema({ body: schema });
};

// Params validation middleware
export const validateParams = (schema: ZodSchema) => {
  return validateSchema({ params: schema });
};

// Query validation middleware
export const validateQuery = (schema: ZodSchema) => {
  return validateSchema({ query: schema });
};

// Combined validation for common patterns
export const validateCreate = (bodySchema: ZodSchema) => {
  return validateBody(bodySchema);
};

export const validateUpdate = (bodySchema: ZodSchema, paramsSchema: ZodSchema) => {
  return validateSchema({ body: bodySchema, params: paramsSchema });
};

export const validateGetById = (paramsSchema: ZodSchema) => {
  return validateParams(paramsSchema);
};

export const validateList = (querySchema: ZodSchema) => {
  return validateQuery(querySchema);
};

// Error response formatter
export const formatValidationError = (error: ZodError) => {
  return {
    success: false,
    message: 'Validation failed',
    errors: error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
      received: (err as any).received,
    })),
  };
};

// Common validation schemas for parameters
export const commonSchemas = {
  id: z.object({
    id: z.string().cuid('Invalid ID format'),
  }),
  
  pagination: z.object({
    page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().min(1)).default('1'),
    limit: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().min(1).max(100)).default('20'),
  }),
  
  search: z.object({
    q: z.string().max(200).optional(),
    category: z.string().max(100).optional(),
    sortBy: z.string().max(50).optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
};

// Async validation wrapper
export const asyncValidate = <T>(
  validationFn: (data: unknown) => Promise<T>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await validationFn(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(formatValidationError(error));
      }
      
      return res.status(500).json({
        success: false,
        message: 'Validation error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
};
