import { v4 as uuidv4 } from 'uuid'
import config from '../config'
import { SvgModel, SvgData } from '../models/svg.model'
import { SvgProcessor, SpriteInfo } from '../utils/svg-processor'
import { logger } from '../utils/logger'
import { ApiError } from '../middleware/error.middleware'

// Upload result interface
export interface UploadResult {
    svg?: SvgData
    svgs?: SvgData[]
    sprite: SpriteInfoWithExtras
}

// Sprite info with extra data
export interface SpriteInfoWithExtras extends SpriteInfo {
    tsDef: string
    cdnUrl: string
}

/**
 * SVG Service
 */

export class SvgService {
    /**
     * Upload and process SVG file
     */
    static async uploadSvg(
        file: Express.Multer.File | undefined,
        user: Record<string, any> | undefined
    ): Promise<UploadResult> {
        try {
            if (!file) {
                throw new ApiError('No file uploaded', 400)
            }

            // Save SVG metadata
            const svgId = uuidv4()
            const svgData: Partial<SvgData> = {
                id: svgId,
                originalName: file.originalname,
                filename: file.filename,
                path: file.path,
                mimeType: file.mimetype,
                size: file.size,
                uploadedBy: user ? user.id : 'anonymous',
                createdAt: new Date(),
                updatedAt: new Date()
            }

            // Save Svg to store
            const savedSvg = SvgModel.create(svgData)

            // Create a sprite with just this SVG
            const spriteInfo = await SvgProcessor.createSprite([file], svgId)

            // Generate TypeScript definition
            const tsDefPath = await SvgProcessor.generateTypeDefinition(spriteInfo)

            // Clean up temporary file
            await SvgProcessor.cleanupFiles([file.path])

            // Return combined data
            return {
                svg: savedSvg,
                sprite: {
                    ...spriteInfo,
                    tsDef: tsDefPath,
                    cdnUrl: `${config.cdn.baseUrl}${spriteInfo.jsPath}`
                }
            }
        } catch (error) {
            logger.error('Failed to upload SVG', { error })
            if (file && file.path) {
                await SvgProcessor.cleanupFiles([file.path])
            }
            throw error
        }
    }

    /**
     * upload and process multiple SVG files
     */
    static async uploadMultipleSvgs(
        files: Express.Multer.File[] | undefined,
        user: Record<string, any> | undefined
    ): Promise<UploadResult> {
        try {
            if (!files || files.length === 0) {
                throw new ApiError('No files uploaded', 400)
            }

            // Generate sprite ID
            const spriteId = uuidv4()

            // Save SVG metadata for each file
            const savedSvgs = files.map(file => {
                const svgId = uuidv4()
                const svgData: Partial<SvgData> = {
                    id: svgId,
                    originalName: file.originalname,
                    filename: file.filename,
                    path: file.path,
                    mimeType: file.mimetype,
                    size: file.size,
                    uploadedBy: user ? user.id : 'anonymous',
                    createdAt: new Date()
                }
                return SvgModel.create(svgData)
            })

            // Creat a sprite with all SVGs
            const spriteInfo = await SvgProcessor.createSprite(files, spriteId)

            // Generate TypeScript definition
            const tsDefPath = await SvgProcessor.generateTypeDefinition(spriteInfo)

            // Clean up temporary files
            await SvgProcessor.cleanupFiles(files.map(file => file.path))

            // Return combined data
            return {
                svgs: savedSvgs,
                sprite: {
                    ...spriteInfo,
                    tsDef: tsDefPath,
                    cdnUrl: `${config.cdn.baseUrl}${spriteInfo.jsPath}`
                }
            }
        } catch (error) {
            logger.error('Failed to upload multiple SVGs', { error })
            if (files && files.length > 0) {
                await SvgProcessor.cleanupFiles(files.map(file => file.path))
            }
            throw error
        }
    }

    /**
     * Get SVG by ID
     */
    static async getSvgById(id: string): Promise<{ svg: SvgData; cdnUrl: string }> {
        const svg = SvgModel.findById(id)

        if (!svg) {
            throw new ApiError('SVG not found', 404)
        }

        return {
            svg,
            cdnUrl: `${config.cdn.baseUrl}/sprites/${svg.id}.js`
        }
    }

    /**
     * Get all SVGs
     */
    static async getAllSvgs(filter: { uploadedBy?: string } = {}): Promise<(SvgData & { cdnUrl: string })[]> {
        const svgs = SvgModel.findAll(filter)

        return svgs.map(svg => ({
            ...svg,
            cdnUrl: `${config.cdn.baseUrl}/sprites/${svg.id}.js`
        }))
    }

    /**
     * Delete SVG by ID
     */
    static async deleteSvg(id: string): Promise<boolean> {
        const deleted = SvgModel.deleteById(id)

        if (!deleted) {
            throw new ApiError('SVG not found', 404)
        }

        return true
    }
}
