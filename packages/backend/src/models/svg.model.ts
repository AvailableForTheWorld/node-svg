import { v4 as uuidv4 } from 'uuid'

// SVG data interface
export interface SvgData {
    id: string
    originalName: string
    filename: string
    path: string
    mimeType: string
    size: number
    uploadedBy: string
    createdAt: Date
    updatedAt: Date
}

// In-memory store for SVG metadata
const svgStore: SvgData[] = []

/**
 * SVG Model
 */
export class SvgModel {
    /**
     * Add a new SVG to the store
     */
    static create(svgData: Partial<SvgData>): SvgData {
        const now = new Date()
        const newSvg: SvgData = {
            id: svgData.id || uuidv4(),
            originalName: svgData.originalName || '',
            filename: svgData.filename || '',
            path: svgData.path || '',
            mimeType: svgData.mimeType || '',
            size: svgData.size || 0,
            uploadedBy: svgData.uploadedBy || 'anonymous',
            createdAt: svgData.createdAt || now,
            updatedAt: svgData.updatedAt || now
        }
        svgStore.push(newSvg)
        return newSvg
    }

    /**
     * Find an SVG by ID
     */
    static findById(id: string): SvgData | undefined {
        return svgStore.find(svg => svg.id === id)
    }

    /**
     * Find all SVGs
     */
    static findAll(filter: { uploadedBy?: string } = {}): SvgData[] {
        return svgStore.filter(svg => (filter.uploadedBy ? svg.uploadedBy === filter.uploadedBy : true))
    }

    /**
     * Update an SVG by ID
     */
    static updateById(id: string, updateData: Partial<SvgData>): SvgData | undefined {
        const index = svgStore.findIndex(svg => svg.id === id)
        if (index === -1) {
            return undefined
        }
        const updatedSvg = {
            ...svgStore[index],
            ...updateData,
            updatedAt: new Date()
        }
        svgStore[index] = updatedSvg
        return updatedSvg
    }

    /**
     * Delete an SVG by ID
     */
    static deleteById(id: string): boolean {
        const index = svgStore.findIndex(svg => svg.id === id)
        if (index === -1) {
            return false
        }
        svgStore.splice(index, 1)
        return true
    }

    /**
     * Delete multiple SVGs
     */
    static deleteMany(ids: string[]): number {
        const initCount = svgStore.length

        // Filter out svgs with IDS in the provided array
        for (let i = svgStore.length - 1; i >= 0; --i) {
            if (ids.includes(svgStore[i].id)) {
                svgStore.splice(i, 1)
            }
        }
        return initCount - svgStore.length
    }
}
