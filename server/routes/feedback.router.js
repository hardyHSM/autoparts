import { Router } from 'express'
import { body } from 'express-validator'
import FeedbackController from '../controllers/feedback.controller.js'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'
import validationMiddleware from '../middlewares/validation.middleware.js'



const router = new Router()

router.post('',
    csrfTokenMiddleware,
    body('email').escape().isEmail(),
    body('name').escape().isLength({min: 2}),
    body('text').escape().isLength({min: 5}),
    validationMiddleware,
    FeedbackController.addMessage)


export default router