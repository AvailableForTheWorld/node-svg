import fs from 'fs'
import path from 'path'
import util from 'util'
import svgstore from 'svgstore'
import { v4 as uuidv4 } from 'uuid'
import { logger } from './logger'

// Convert fs functions to promise-based
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const unlink = util.promisify(fs.unlink)

// Sprite information interface
export interface SpriteInfo {
    id: string
    svgCount: number
    svgPath: string
    jsPath: string
    iconIds: string[]
}

/**
 * SVG Processor utility
 */
export class SvgProcessor {
    /**
     * Create SVG sprite from multiple SVG files
     */
    static async createSprite(svgFiles: Express.Multer.File[], spriteId: string | null = null): Promise<SpriteInfo> {
        try {
            // Generate an unique ID for the sprite if not provided
            const spriteUniqueId = spriteId || uuidv4()

            // Create a new SVG sprite
            const sprite = svgstore({
                cleanDefs: true,
                cleanSymbols: true,
                svgAttrs: {
                    style: 'display: none;',
                    'aria-hidden': 'true'
                }
            })

            // Add each SVG file to the sprite
            const iconIds: string[] = []
            for (const file of svgFiles) {
                // Read the SVG file
                const svgContent = await readFile(file.path, 'utf-8')

                // Generate a unique ID for this SVG
                const svgId = path.basename(file.originalname, '.svg').replace(/[^a-zA-Z0-9]/g, '-')
                iconIds.push(svgId)

                // Add the SVG to the sprite
                sprite.add(svgId, svgContent)

                // log
                logger.debug(`Added SVG ${file.originalname} to sprite as ${svgId}`)
            }

            // Output paths
            const spritePath = path.join(__dirname, `../../public/uploads/sprites/${spriteUniqueId}.svg`)
            const jsPath = path.join(__dirname, `../../public/uploads/sprites/${spriteUniqueId}.js`)

            // Save the sprite SVG
            await writeFile(spritePath, sprite.toString())

            // Create JS file content

            const jsContent = `
                /**
                 * SVG Sprite ${spriteUniqueId}
                 * Generate on ${new Date().toISOString()}
                 */ 
                (function(window, document){
                'use strict'
                if(!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect){
                    return true
                }
                const svgSprite = \`${sprite.toString().replace(/\\/g, '\\\\').replace(/`/g, '\\`')}\`;
                
                // Create a hidden div element
                const div = document.createElement('div');
                div.style.display = 'none';
                div.innerHTML = svgSprite;
                
                // Insert the sprite into the DOM
                document.body.insertBefore(div, document.body.childNodes[0]);
                
                // Expose SVG icon ids
                window.SVG_ICONS = {
                    ${iconIds.map(id => `'${id}': '${id}'`).join(',\n    ')}
                };
                })(window, document);
            `

            // Save the JS file
            await writeFile(jsPath, jsContent)

            logger.info(`Created SVG sprite (ID: ${spriteUniqueId}) with ${svgFiles.length} icons`)

            return {
                id: spriteUniqueId,
                svgCount: svgFiles.length,
                svgPath: `/sprites/${spriteUniqueId}.svg`,
                jsPath: `/sprites/${spriteUniqueId}.js`,
                iconIds: iconIds
            }
        } catch (error) {
            logger.error(`Failed to create SVG sprite`, { error })
            throw error
        }
    }

    /**
     * Clean up temporary SVG files
     */
    static async cleanupFiles(filePaths: string[]): Promise<void> {
        try {
            for (const filePath of filePaths) {
                await unlink(filePath)
                logger.debug(`Deleted temporary file: ${filePath}`)
            }
        } catch (error) {
            logger.error(`Failed to delete temporary files`, { error })
        }
    }

    /**
     * Generate TypeScript definition file for SVG sprite
     */
    static async generateTypeDefinition(spriteInfo: SpriteInfo): Promise<string> {
        try {
            // Create TypeScript definition content
            const tsContent = `
             /** 
              * SVG Sprite TypeScript definitions
              * Sprite ID: ${spriteInfo.id}
              * Generated on ${new Date().toISOString()} 
              */

             declare global {
                interface Window {
                    SVG_ICONS: {
                        ${spriteInfo.iconIds.map(id => `'${id}': '${id}';`).join('\n    ')}
                    }
                }
             }

             export type SvgIconName = ${spriteInfo.iconIds.map(id => `'${id}'`).join(' | ')}

            /**
             * Interface for SVG Icon component props
             */
            export interface SvgIconProps {
                name: SvgIconName;
                className?: string;
                width?: number | string;
                height?: number | string;
                color?: string;
                title?: string;
                onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
            }

            // This export is required to make this a module
            export {}
            `

            // Output path
            const tsPath = path.join(__dirname, `../../public/uploads/sprites/${spriteInfo.id}.d.ts`)

            // Save the TypeScript definition file
            await writeFile(tsPath, tsContent)

            logger.info(`Generated TypeScript definition file for sprite (ID: ${spriteInfo.id})`)

            return `/sprites/${spriteInfo.id}.d.ts`
        } catch (error) {
            logger.error(`Failed to generate TypeScript definition file`, { error })
            throw error
        }
    }
}
