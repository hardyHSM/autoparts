import { Router } from 'express'
import { body } from 'express-validator'
import feedbackController from '../controllers/feedback.controller.js'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'
import validationMiddleware from '../middlewares/validation.middleware.js'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import adminAccessMiddleware from '../middlewares/admin.middleware.js'



const router = new Router()

router.get('',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    validationMiddleware,
    feedbackController.get)

router.put('',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    validationMiddleware,
    feedbackController.change)

router.delete('',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    validationMiddleware,
    feedbackController.delete)


router.post('',
    csrfTokenMiddleware,
    body('email').escape().isEmail(),
    body('name').escape().isLength({min: 2}),
    body('text').escape().isLength({min: 5}),
    validationMiddleware,
    feedbackController.addMessage)


export default router