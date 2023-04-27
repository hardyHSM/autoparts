import { Router } from 'express'
import ordersController from '../controllers/orders.controller.js'
import { body } from 'express-validator'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'
import validationMiddleware from '../middlewares/validation.middleware.js'

const router = new Router()

router.post('/add',
    csrfTokenMiddleware,
    body('email').escape().isEmail(),
    body('firstName').escape().exists().matches(/^[А-яa-z ,.'-]+$/).not().matches(/\d/),
    body('lastName').escape().exists().matches(/^[А-яa-z ,.'-]+$/).not().matches(/\d/),
    body('tel').escape().isLength({min: 18, max: 18}),
    validationMiddleware,
    ordersController.addOrder
)


export default router