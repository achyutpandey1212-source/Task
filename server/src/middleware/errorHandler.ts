import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Handle generic / unexpected errors
  console.error('[Unhandled Error]', err);

  const isProduction = env.NODE_ENV === 'production';
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: isProduction ? 'An unexpected internal error occurred' : err.message,
      ...(isProduction ? {} : { stack: err.stack }),
    },
  });
}
