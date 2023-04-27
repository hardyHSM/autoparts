import { Router } from 'express'
import locationController from '../controllers/location.controller.js'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'

const router = new Router()

// API

router.get('', locationController.getLocations)
router.post('', authAccessMiddleware, csrfTokenMiddleware, locationController.setLocation
)
router.post('/id', locationController.getLocationById)


export default router