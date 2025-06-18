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
 * @route GET /api/svg/:id
 * @desc Get SVG by ID
 * @access Public
 */
router.get('/:id', SvgController.getSvgById)

/**
 * @route GET /api/svg
 * @desc Get all SVGs
 * @access Public
 */
router.get('/', SvgController.getAllSvgs)

/**
 * @route DELETE /api/svg/:id
 * @desc Delete SVG by ID
 * @access Public
 */
router.delete('/:id', authenticate, SvgController.deleteSvg)

export default router
