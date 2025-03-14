// Use the shared environment configuration
const env = require('../../shared/env');
const dotenv = require('dotenv');

// Load environment variables from the monorepo root
dotenv.config({ path: env.dotenvPath });

// Default configuration values
const config = {
  // Server configuration
  port: process.env.BACKEND_PORT || 3002,
  
  // Frontend URL for CORS (if needed)
  frontendUrl: env.getFrontendUrl()
};

module.exports = config;
