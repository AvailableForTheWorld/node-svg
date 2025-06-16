import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import config from '../config'
import { ApiError } from './error.middleware'

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'))
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`
        cb(null, uniqueFilename)
    }
})

// File filter to allow only svg
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new ApiError('Only SVG files are allowed', 400))
    }
}

// Create multer upload instance
const upload = multer({
    storage,
    limits: {
        fileSize: config.upload.maxSize
    },
    fileFilter
})

// Middleware to handle single SVG upload
const uploadSingleMiddleware = upload.single('svg')

// Middleware to handle multiple SVG uploads with 10-count limitation
const uploadMultipleMiddleware = upload.array('svg', 10)

// Middleware to handle upload errors
const uploadErrorHandler = (req: Request, res: Response, next: NextFunction) => {
    return (err: any) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new ApiError(`File too large. Max size is ${config.upload.maxSize / (1024 * 1024)}MB`, 400))
            }

            return next(new ApiError(err.message, 400))
        }
        else if(err) {
            return next(err)
        }
        next()
    }
}

export const uploadSvg = (req: Request, res: Response, next: NextFunction) => {
    uploadSingleMiddleware(req, res, uploadErrorHandler(req, res, next))
}

export const uploadMultipleSvgs = (req: Request, res: Response, next: NextFunction) => {
    uploadMultipleMiddleware(req, res, uploadErrorHandler(req, res, next))
}
