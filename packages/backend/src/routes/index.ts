import express from 'express'
import svgRoutes from './svg.routes'

const router: express.Router = express.Router()

router.get('/health', (req: express.Request, res: express.Response) => {
    res.status(200).json({
        status: 'success',
        message: 'API is running',
        timestamp: new Date().toISOString()
    })
})

router.use('/svg', svgRoutes)

export default router
