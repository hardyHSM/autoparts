import { Router } from 'express'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'
import analyticsController from '../controllers/analytics.controller.js'

const router = new Router()


router.get('', authAccessMiddleware, csrfTokenMiddleware, analyticsController.getInfo)


export default router