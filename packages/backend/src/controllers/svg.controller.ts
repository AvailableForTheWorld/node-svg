import { Request, Response, NextFunction } from 'express'
import { SvgService } from '../services/svg.service'

/**
 * SVG Controller
 */
export class SvgController {
    /**
     * Upload a single SVG and regenerate the font
     */
    static async uploadSvg(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await SvgService.uploadSvg(req.file)
            res.status(201).json({ status: 'success', data: result })
        } catch (error) {
            next(error)
        }
    }

    /**
     * Upload multiple SVGs and regenerate the font
     */
    static async uploadMultipleSvgs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const files = req.files as Express.Multer.File[]
            const result = await SvgService.uploadMultipleSvgs(files)
            res.status(201).json({ status: 'success', data: result })
        } catch (error) {
            next(error)
        }
    }

    /**
     * Delete an SVG by its filename and regenerate the font
     */
    static async deleteSvg(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { filename } = req.params
            const result = await SvgService.deleteSvg(filename)
            res.status(200).json({ status: 'success', data: result })
        } catch (error) {
            next(error)
        }
    }
}
