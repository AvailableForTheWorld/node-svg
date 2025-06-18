import { Request, Response, NextFunction } from 'express'
import { SvgService } from '../services/svg.service'

/**
 * SVG Controller
 */
export class SvgController {
    /**
     * Upload a single SVG
     */
    static async uploadSvg(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await SvgService.uploadSvg(req.file, req.user)
            res.status(201).json({ status: 'success', data: result })
        } catch (error) {
            next(error)
        }
    }

    /**
     * Upload multiple SVGs
     */
    static async uploadMultipleSvgs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const files = req.files as Express.Multer.File[]
            const result = await SvgService.uploadMultipleSvgs(files, req.user)
            res.status(201).json({ status: 'success', data: result })
        } catch (error) {
            next(error)
        }
    }

    /**
     * Get SVG by ID
     */

    static async getSvgById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const result = await SvgService.getSvgById(id)

            res.status(200).json({
                status: 'success',
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * Get all SVGs
     */
    static async getAllSvgs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Extract filter parameters from query
            const filter: { uploadedBy?: string } = {}
            if (req.query.uploadedBy) {
                filter.uploadedBy = req.query.uploadedBy as string
            }
            const svgs = await SvgService.getAllSvgs(filter)
            res.status(200).json({ status: 'success', count: svgs.length, data: svgs })
        } catch (error) {
            next(error)
        }
    }

    /**
     * Delete SVG by ID
     */
    static async deleteSvg(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            await SvgService.deleteSvg(id)

            res.status(200).json({ status: 'success', message: 'SVG deleted successfully' })
        } catch (error) {
            next(error)
        }
    }
}
