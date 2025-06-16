import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'
import { ApiError } from './error.middleware'

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any>
        }
    }
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError('Authentication required', 401)
        }
        const token = authHeader.split(' ')[1]
        if (!token) {
            throw new ApiError('Authentication token missing', 401)
        }

        // Verify the token
        const decoded = jwt.verify(token, config.jwt.secret)

        // Add the user data to the requrest
        req.user = decoded as Record<string, any>

        next()
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'JsonWebTokenError') {
                next(new ApiError('Invalid token', 401))
            }
            if (error.name === 'TokenExpiredError') {
                next(new ApiError('Token expired', 401))
            }
            next(error)
        }
        next(new ApiError('Authentication required', 401))
    }
}
