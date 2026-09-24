import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { isDatabaseConnected } from './config/database.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { problemRouter } from './modules/problems/problem.routes.js';
import { attemptRouter } from './modules/attempts/attempt.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { NotFoundError } from './shared/errors/AppError.js';

export function createApp(): Application {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    const dbConnected = isDatabaseConnected();
    const statusCode = dbConnected ? 200 : 503;

    res.status(statusCode).json({
      status: dbConnected ? 'ok' : 'degraded',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Auth routes
  app.use('/api/auth', authRouter);

  // Problem routes (Public)
  app.use('/api/problems', problemRouter);

  // Attempt routes (Authenticated)
  app.use('/api/attempts', attemptRouter);

  // Catch unhandled 404 routes
  app.use((_req: Request, _res: Response, next) => {
    next(new NotFoundError('The requested resource was not found'));
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
