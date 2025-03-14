/**
 * Shared environment configuration for both frontend and backend
 * This ensures consistent values across the monorepo
 */
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Find the root directory of the monorepo
export const findMonorepoRoot = (startPath: string): string => {
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
export const monorepoRoot = findMonorepoRoot(__dirname);

// Path to the .env file in the monorepo root
export const dotenvPath = path.join(monorepoRoot, '.env');

// Load the environment variables
dotenv.config({ path: dotenvPath });

// Environment utility functions
export const getBackendUrl = (): string => 
  process.env.BACKEND_URL || `http://localhost:${process.env.BACKEND_PORT || 3002}`;

export const getFrontendUrl = (): string => 
  process.env.FRONTEND_URL || `http://localhost:${process.env.FRONTEND_PORT || 5173}`;

// Default export for compatibility with existing code
export default {
  monorepoRoot,
  dotenvPath,
  getBackendUrl,
  getFrontendUrl
};
