import { Router } from 'express'
import { body } from 'express-validator'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'
import pagesController from '../controllers/pages.controller.js'
import adminAccessMiddleware from '../middlewares/admin.middleware.js'


const router = new Router()


router.get('', pagesController.get)
router.put('', pagesController.change)
router.post('', pagesController.add)
router.delete('', pagesController.delete)

export default router