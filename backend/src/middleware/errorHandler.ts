import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error occurred:', { error: error.message, stack: error.stack });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'fail',
      message: error.message
    });
  }

  const response = {
    status: 'fail',
    message: 'Internal server error'
  };

  if (process.env.NODE_ENV === 'development') {
    Object.assign(response, { stack: error.stack });
  }

  return res.status(500).json(response);
};

export default errorHandler; 