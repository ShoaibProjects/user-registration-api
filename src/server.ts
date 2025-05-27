import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware: Parse incoming JSON bodies
app.use(express.json());

// Middleware: Simple request logger (can replace with morgan if needed)
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Register API routes
app.use('/api', authRoutes);

// Serve static files from 'public' folder
app.use(express.static('public'));

// 404 handler for unmatched routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler middleware
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Global error handler:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
);

// Start the server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// Graceful shutdown handler (optional)
process.on('SIGINT', () => {
  console.log('SIGINT received: closing server');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
