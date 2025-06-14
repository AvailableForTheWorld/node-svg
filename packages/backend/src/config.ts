import * as dotenv from 'dotenv'
import * as env from '../../shared/env'

dotenv.config()

// Backend configuration interface
export interface BackendConfig {
    server: {
        port: number
        env: string
        frontendUrl: string
    }
    jwt: {
        secret: string
        expiresIn: string
    }
    upload: {
        maxSize: number
        allowedTypes: string[]
    }
    cdn: {
        baseUrl: string
        spriteDir: string
    }
}

// Default configuration values
const config: BackendConfig = {
    // Server configuration
    server: {
        port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3002,
        env: process.env.NODE_ENV || 'development',
        frontendUrl: env.getFrontendUrl()
    },

    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'test',
        expiresIn: process.env.JWT_EXPIRES_IN || '1y'
    },

    // File upload configuration
    upload: {
        maxSize: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE, 10) : 5 * 1024 * 1024, // 5MB default
        allowedTypes: ['image/svg+xml']
    },

    // CDN configuration
    cdn: {
        baseUrl: process.env.CDN_BASE_URL || `http://localhost:${process.env.PORT || 3002}`,
        spriteDir: 'sprites'
    }
}

export default config
