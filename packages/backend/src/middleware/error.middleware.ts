import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    statusCode: number

    constructor(message: string, statusCode: number) {
        super(message)
        this.name = this.constructor.name
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}

/**
 * Global error handling middleware
 */
export const errorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
    // log the error
    logger.error(`${err.name}: ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method
    })

    // Determine status code
    const statusCode = 'statusCode' in err ? err.statusCode : 500
    const message = statusCode === 500 ? 'Internal server error' : err.message
    const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined
    // send response
    res.status(statusCode).json({
        status: 'error',
        message,
        stack
    })
}
