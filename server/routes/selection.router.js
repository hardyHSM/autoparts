import { Router } from 'express'
import { body } from 'express-validator'
import selectionController from '../controllers/selection.controller.js'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'
import validationMiddleware from '../middlewares/validation.middleware.js'



const router = new Router()

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