import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

async function bootstrap() {
  try {
    // 1. Establish database connection
    await connectDatabase();

    // 2. Initialize application
    const app = createApp();

    // 3. Start HTTP server
    const server = app.listen(env.PORT, () => {
      console.log(`[Server] Running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('[Server] Fatal startup error:', error);
    process.exit(1);
  }
}

bootstrap();
