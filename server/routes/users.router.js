import { Router } from 'express'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import adminAccessMiddleware from '../middlewares/admin.middleware.js'
import validationMiddleware from '../middlewares/validation.middleware.js'
import userController from '../controllers/user.controller.js'
import { body } from 'express-validator'

const router = new Router()


router.get('',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    validationMiddleware,
    userController.get)

router.delete('',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    validationMiddleware,
    userController.delete)


router.put('',
    body('email').escape().isEmail().trim(),
    body('firstName').trim().escape().exists().matches(/^[ЁёА-я ,.'-]+$/).not().matches(/\d/),
    body('lastName').escape().trim(),
    body('tel').escape().isLength({ min: 18, max: 18 }),
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    validationMiddleware,
    userController.change
)


export default router