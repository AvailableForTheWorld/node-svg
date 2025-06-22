import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { logger } from './logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Directory for storing raw uploaded SVG files
const ICONS_DIR = path.resolve(__dirname, '../assets/icons')

// Directory for storing generated font files
const FONTS_DIR = path.resolve(__dirname, '../../public/fonts')

// Interface for the paths of the generated font files
export interface FontPaths {
    css: string
    woff2: string
    woff: string
    ttf: string
}

export const FONT_NAME = 'custom-icon-font'

/**
 * SVG to Font Processor utility
 */
export class SvgProcessor {
    /**
     * Ensures that the necessary directories exist.
     */
    private static async setupDirectories(): Promise<void> {
        await fs.ensureDir(ICONS_DIR)
        await fs.ensureDir(FONTS_DIR)
    }

    /**
     * Saves an uploaded SVG file to the persistent icons directory.
     * @param file The uploaded SVG file.
     * @returns The path to the saved file.
     */
    static async saveIcon(file: Express.Multer.File): Promise<string> {
        await this.setupDirectories()
        // Sanitize filename to prevent directory traversal
        const safeFilename = path.basename(file.originalname)
        const destinationPath = path.join(ICONS_DIR, safeFilename)
        await fs.move(file.path, destinationPath, { overwrite: true })
        logger.info(`Saved icon: ${safeFilename}`)
        return destinationPath
    }

    /**
     * Creates a webfont from all SVGs in the icons directory.
     */
    static async createFont(): Promise<FontPaths> {
        try {
            await this.setupDirectories()
            logger.info(`Starting font generation from icons in: ${ICONS_DIR}`)

            const files = await fs.readdir(ICONS_DIR)
            if (files.length === 0) {
                logger.warn('No icons found to generate font.')
                throw new Error('No SVG files available to generate a font.')
            }

            const { default: svgtofont } = await import('svgtofont')

            await svgtofont({
                src: ICONS_DIR,
                dist: FONTS_DIR,
                fontName: FONT_NAME,
                css: {
                    // Generate a CSS file with this name
                    fileName: FONT_NAME
                },
                emptyDist: true, // Clean the output directory before generating
                website: {
                    title: 'Custom Icon Font',
                    logo: '',
                    // We don't need the demo website for this use case
                    template: undefined,
                    links: []
                }
            })

            const fontPaths: FontPaths = {
                css: path.join(FONTS_DIR, `${FONT_NAME}.css`),
                woff2: path.join(FONTS_DIR, `${FONT_NAME}.woff2`),
                woff: path.join(FONTS_DIR, `${FONT_NAME}.woff`),
                ttf: path.join(FONTS_DIR, `${FONT_NAME}.ttf`)
            }

            logger.info(`Successfully generated font "${FONT_NAME}" with ${files.length} icons.`)
            return fontPaths
        } catch (error) {
            logger.error('Failed to create webfont', { error })
            throw error
        }
    }

    /**
     * Deletes an icon and regenerates the font.
     * @param iconName The filename of the icon to delete.
     */
    static async deleteIcon(iconName: string): Promise<void> {
        try {
            const iconPath = path.join(ICONS_DIR, iconName)
            if (await fs.pathExists(iconPath)) {
                await fs.remove(iconPath)
                logger.info(`Deleted icon: ${iconName}`)
                // Regenerate the font after deleting an icon
                await this.createFont()
            } else {
                logger.warn(`Attempted to delete non-existent icon: ${iconName}`)
            }
        } catch (error) {
            logger.error(`Failed to delete icon ${iconName}`, { error })
            throw error
        }
    }
}
