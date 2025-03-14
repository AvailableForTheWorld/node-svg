/**
 * Shared environment configuration for both frontend and backend
 * This ensures consistent values across the monorepo
 */
const path = require('path');
const fs = require('fs');

// Find the root directory of the monorepo
const findMonorepoRoot = (startPath) => {
  // Start from the current directory and go up until we find a package.json with workspaces
  let currentDir = startPath;
  
  while (currentDir !== '/') {
    const packageJsonPath = path.join(currentDir, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.workspaces) {
          return currentDir;
        }
      } catch (e) {
        // Continue searching upward
      }
    }
    
    // Go up one directory
    currentDir = path.dirname(currentDir);
  }
  
  // If we reached the root without finding a monorepo root, return the starting directory
  return startPath;
};

// Get the monorepo root path
const monorepoRoot = findMonorepoRoot(__dirname);

// Load the .env file from the monorepo root
const dotenvPath = path.join(monorepoRoot, '.env');

// Export the paths for other modules to use
module.exports = {
  monorepoRoot,
  dotenvPath,
  // Add environment variable getters/utility functions here
  getBackendUrl: () => process.env.BACKEND_URL || `http://localhost:${process.env.BACKEND_PORT || 3002}`,
  getFrontendUrl: () => process.env.FRONTEND_URL || `http://localhost:${process.env.FRONTEND_PORT || 5173}`
};
