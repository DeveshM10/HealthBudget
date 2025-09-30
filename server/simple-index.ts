import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
    }
  }
}

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

// Test route
app.get('/', (req, res) => {
  res.send('HealthBudget API is running!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`API URL: http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});

export default app;
