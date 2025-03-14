// Use the shared environment configuration
import * as env from '../../shared/env';

// Backend configuration interface
interface BackendConfig {
  port: number;
  frontendUrl: string;
}

// Default configuration values
const config: BackendConfig = {
  // Server configuration
  port: process.env.BACKEND_PORT ? parseInt(process.env.BACKEND_PORT, 10) : 3002,
  
  // Frontend URL for CORS (if needed)
  frontendUrl: env.getFrontendUrl()
};

export default config;
