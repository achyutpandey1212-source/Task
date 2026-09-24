import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { isDatabaseConnected } from './config/database.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { problemRouter } from './modules/problems/problem.routes.js';
import { attemptRouter } from './modules/attempts/attempt.routes.js';
import { evaluationRouter } from './modules/evaluations/evaluation.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { NotFoundError } from './shared/errors/AppError.js';

export function createApp(): Application {
  const app = express();

  const allowedOrigins = env.CLIENT_URL.split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  // CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);

        const cleanOrigin = origin.replace(/\/+$/, '');
        const isAllowed =
          allowedOrigins.includes(cleanOrigin) ||
          cleanOrigin.endsWith('.vercel.app') ||
          env.NODE_ENV === 'development';

        if (isAllowed) {
          return callback(null, true);
        }
        return callback(new Error(`Not allowed by CORS: ${origin}`));
      },
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

  // Evaluation routes (Authenticated)
  app.use('/api/evaluations', evaluationRouter);

  // Catch unhandled 404 routes
  app.use((_req: Request, _res: Response, next) => {
    next(new NotFoundError('The requested resource was not found'));
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
