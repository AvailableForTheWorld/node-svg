import express, { Router } from 'express'
import { SvgController } from '../controllers/svg.controller'
import { uploadSvg, uploadMultipleSvgs } from '../middleware/upload.middleware'
import { authenticate } from '../middleware/auth.middleware'

const router: Router = express.Router()

/**
 * @route POST /api/svg
 * @desc Upload a single SVG
 * @access Public
 */
router.post('/', uploadSvg, SvgController.uploadSvg)

/**
 * @route POST /api/svg/multiple
 * @desc Upload multiple SVGs
 * @access Public
 */
router.post('/multiple', uploadMultipleSvgs, SvgController.uploadMultipleSvgs)

/**
 * @route DELETE /api/svg/:filename
 * @desc Delete SVG by its filename
 * @access Public
 */
router.delete('/:filename', authenticate, SvgController.deleteSvg)

export default router
