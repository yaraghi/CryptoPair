import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const symbolSchema = z.string().min(1).max(10).regex(/^[A-Za-z0-9]+$/);

const querySchema = z.object({
  base: symbolSchema,
  quote: symbolSchema
});

export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  try {
    querySchema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({ 
        error: 'Invalid input parameters',
        details: errors
      });
    }
    next(error);
  }
}; 