import path from 'path'
import config from '../config'
import { SvgProcessor, FONT_NAME, FontPaths } from '../utils/svg-processor'
import { logger } from '../utils/logger'
import { ApiError } from '../middleware/error.middleware'

// Font generation result interface
export interface FontGenerationResult {
    message: string
    fontName: string
    cssUrl: string
    fontUrls: {
        woff2: string
        woff: string
        ttf: string
    }
}

/**
 * SVG Service
 */
export class SvgService {
    private static getFontUrls(fontPaths: FontPaths): FontGenerationResult['fontUrls'] {
        const baseUrl = config.cdn.baseUrl
        return {
            woff2: `${baseUrl}/fonts/${path.basename(fontPaths.woff2)}`,
            woff: `${baseUrl}/fonts/${path.basename(fontPaths.woff)}`,
            ttf: `${baseUrl}/fonts/${path.basename(fontPaths.ttf)}`
        }
    }

    /**
     * Upload and process a single SVG file
     */
    static async uploadSvg(file: Express.Multer.File | undefined): Promise<FontGenerationResult> {
        if (!file) {
            throw new ApiError('No file uploaded', 400)
        }

        try {
            await SvgProcessor.saveIcon(file)
            const fontPaths = await SvgProcessor.createFont()

            return {
                message: 'Successfully uploaded 1 icon and regenerated font.',
                fontName: FONT_NAME,
                cssUrl: `${config.cdn.baseUrl}/fonts/${FONT_NAME}.css`,
                fontUrls: this.getFontUrls(fontPaths)
            }
        } catch (error) {
            logger.error('Failed to upload SVG', { error })
            // The processor handles its own cleanup, so we just re-throw
            throw error
        }
    }

    /**
     * Upload and process multiple SVG files
     */
    static async uploadMultipleSvgs(files: Express.Multer.File[] | undefined): Promise<FontGenerationResult> {
        if (!files || files.length === 0) {
            throw new ApiError('No files uploaded', 400)
        }

        try {
            for (const file of files) {
                await SvgProcessor.saveIcon(file)
            }
            const fontPaths = await SvgProcessor.createFont()

            return {
                message: `Successfully uploaded ${files.length} icons and regenerated font.`,
                fontName: FONT_NAME,
                cssUrl: `${config.cdn.baseUrl}/fonts/${FONT_NAME}.css`,
                fontUrls: this.getFontUrls(fontPaths)
            }
        } catch (error) {
            logger.error('Failed to upload multiple SVGs', { error })
            throw error
        }
    }

    /**
     * Delete an SVG icon by its filename
     */
    static async deleteSvg(filename: string): Promise<FontGenerationResult> {
        try {
            await SvgProcessor.deleteIcon(filename)
            const fontPaths = await SvgProcessor.createFont()

            return {
                message: `Successfully deleted icon '${filename}' and regenerated font.`,
                fontName: FONT_NAME,
                cssUrl: `${config.cdn.baseUrl}/fonts/${FONT_NAME}.css`,
                fontUrls: this.getFontUrls(fontPaths)
            }
        } catch (error) {
            logger.error(`Failed to delete icon ${filename}`, { error })
            // ApiError from deleteIcon will be propagated
            throw error
        }
    }
}
