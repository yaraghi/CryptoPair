import { Request, Response, NextFunction } from 'express';
import errorHandler from '../errorHandler';
import { AppError } from '../../utils/errors';
import logger from '../../utils/logger';

// Mock logger
jest.mock('../../utils/logger');
const mockedLogger = logger as jest.Mocked<typeof logger>;

describe('errorHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should handle AppError correctly', () => {
    const error = new AppError('Bad request', 400);

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Bad request'
    });
    expect(mockedLogger.error).toHaveBeenCalledWith('Error occurred:', {
      error: 'Bad request',
      stack: error.stack
    });
  });

  it('should handle unknown errors correctly', () => {
    const error = new Error('Internal server error');

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Internal server error'
    });
    expect(mockedLogger.error).toHaveBeenCalledWith('Error occurred:', {
      error: 'Internal server error',
      stack: error.stack
    });
  });

  it('should include stack trace in development environment', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Test error');

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Internal server error',
      stack: error.stack
    });
    expect(mockedLogger.error).toHaveBeenCalledWith('Error occurred:', {
      error: 'Test error',
      stack: error.stack
    });
  });

  it('should not include stack trace in production environment', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Test error');

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Internal server error'
    });
    expect(mockedLogger.error).toHaveBeenCalledWith('Error occurred:', {
      error: 'Test error',
      stack: error.stack
    });
  });
}); 