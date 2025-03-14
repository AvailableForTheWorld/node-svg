import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// We need to use require for the shared env module to work with TypeScript
// @ts-ignore
const sharedEnv = require('../shared/env');
const dotenv = require('dotenv');

// Load the environment variables for use in this config
dotenv.config({ path: sharedEnv.dotenvPath });

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {  
  // Load env file based on `mode` from monorepo root
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, sharedEnv.monorepoRoot, '');
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true
    },
    define: {
      'process.env.BACKEND_URL': JSON.stringify(env.BACKEND_URL || 'http://localhost:3002')
    }
  };
});
