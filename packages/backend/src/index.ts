import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path'
import config from './config';
import  { logger, stream } from './utils/logger';
import { AddressInfo } from 'net';
import fs from 'fs';

// create uploads and sprites directories if they do not exist
const uploadsDir = path.join(__dirname, 'uploads');
const spritesDir = path.join(__dirname, 'sprites');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    logger.info("Created uploads directory")
}
if (!fs.existsSync(spritesDir)) {
    fs.mkdirSync(spritesDir, { recursive: true });
    logger.info("Created sprites directory")
}

const app = express();
const PORT = config.server.port;

// set security headers
app.use(helmet())

// enable cors
app.use(cors())

// enable json parsing
app.use(express.json())

// parse url-encoded bodies
app.use(express.urlencoded({ extended: true }))

// enable morgan logging
app.use(morgan('combined', { stream }))


// Serve static files
app.use(express.static(path.join(__dirname, '../public')))

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend!' });
});

// API health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: '404 Not found'
  })
})


// Start the server and try multiple ports if necessary
async function startServer(port: number, maxRetries: number = 5): Promise<void> {
  let currentPort = port;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const server = app.listen(currentPort, () => {
        const address = server.address() as AddressInfo;
        console.log(`Server running on http://localhost:${address.port}`);
        console.log(`Frontend URL: ${config.server.frontendUrl}`);
      });
      
      // Exit the retry loop on success
      break;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'EADDRINUSE') {
        console.log(`Port ${currentPort} is in use, trying ${currentPort + 1}...`);
        currentPort++;
        retries++;
      } else {
        console.error('Error starting server:', error);
        throw error;
      }
    }
  }

  if (retries >= maxRetries) {
    console.error(`Failed to start server after trying ${maxRetries} ports.`);
    process.exit(1);
  }
}

// Start the server
startServer(PORT).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});