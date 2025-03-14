import express, { Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import { AddressInfo } from 'net';

const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend!' });
});

// Start the server and try multiple ports if necessary
async function startServer(port: number, maxRetries: number = 5): Promise<void> {
  let currentPort = port;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const server = app.listen(currentPort, () => {
        const address = server.address() as AddressInfo;
        console.log(`Server running on http://localhost:${address.port}`);
        console.log(`Frontend URL: ${config.frontendUrl}`);
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
