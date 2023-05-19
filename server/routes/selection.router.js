import { Router } from 'express'
import { body } from 'express-validator'
import selectionController from '../controllers/selection.controller.js'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'
import validationMiddleware from '../middlewares/validation.middleware.js'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import adminAccessMiddleware from '../middlewares/admin.middleware.js'
import FeedbackController from '../controllers/feedback.controller.js'
import feedbackController from '../controllers/feedback.controller.js'



const router = new Router()

router.get('',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    validationMiddleware,
    selectionController.get)

router.delete('',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    validationMiddleware,
    selectionController.delete)

router.put('',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    validationMiddleware,
    selectionController.change)

router.post('',
    csrfTokenMiddleware,
    body('name').escape().trim().exists().matches(/^[А-яa-z ,.'-]+$/).not().matches(/\d/),
    body('email').escape().isEmail(),
    body('detail').escape().isLength({min: 3, max: 128}),
    body('vin').escape().isLength({min: 17, max: 17}),
    body('count').isNumeric(),
    body('partType').escape(),
    validationMiddleware,
    selectionController.addSelection)


export default router