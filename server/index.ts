import express, { type Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { setupVite, serveStatic, log } from './vite';
import { globalErrorHandler } from './utils/error';
import { authRouter } from './routes/auth.routes';
import { env } from './env';
import { testConnection } from './db';

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// 1. GLOBAL MIDDLEWARES
// Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://healthbudget.app', 'https://www.healthbudget.app']
    : 'http://localhost:3000',
  credentials: true,
}));

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Simple root route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('HealthBudget API is running!');
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Test database connection
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Database connection failed');
      return res.status(503).json({
        status: 'error',
        message: 'Service Unavailable - Database connection failed',
      });
    }
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(503).json({
      status: 'error',
      message: 'Service Unavailable - Database connection error',
    });
  }
});

// 2. ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/clinics', (await import('./routes/clinics.routes.js')).default);

// 3. GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

// 4. START SERVER
const PORT = parseInt(process.env.PORT || '5000', 10);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
