/**
 * Shared configuration for the node-svg monorepo
 */

module.exports = {
  // Backend configuration
  backend: {
    port: process.env.BACKEND_PORT || 3002
  },
  
  // Frontend configuration
  frontend: {
    // The URL to connect to the backend
    apiUrl: process.env.API_URL || `http://localhost:${process.env.BACKEND_PORT || 3002}`
  }
};
