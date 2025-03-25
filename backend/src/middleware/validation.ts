import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export function validatePriceRequest(req: Request, res: Response, next: NextFunction) {
  const { base, quote } = req.query;
  
  if (!base || typeof base !== 'string') {
    throw new ValidationError('Base currency is required and must be a string');
  }
  
  if (!quote || typeof quote !== 'string') {
    throw new ValidationError('Quote currency is required and must be a string');
  }
  
  if (base.length < 1 || base.length > 10) {
    throw new ValidationError('Base currency must be between 1 and 10 characters');
  }
  
  if (quote.length < 1 || quote.length > 10) {
    throw new ValidationError('Quote currency must be between 1 and 10 characters');
  }
  
  next();
} 