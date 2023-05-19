import { Router } from 'express'
import categoriesController from '../controllers/categories.controller.js'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import adminAccessMiddleware from '../middlewares/admin.middleware.js'
import { body } from 'express-validator'
import validationMiddleware from '../middlewares/validation.middleware.js'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'

const router = new Router()

router.get('', csrfTokenMiddleware, authAccessMiddleware, adminAccessMiddleware, categoriesController.get)
router.delete('', csrfTokenMiddleware, authAccessMiddleware, adminAccessMiddleware, categoriesController.delete)

router.put('',
    body('name').matches(/^[А-яa-z,. '-]+$/),
    body('link').matches(/^[^0-9а-яА-я]+$/),
    body('order').isNumeric(),
    csrfTokenMiddleware,
    validationMiddleware,
    authAccessMiddleware, adminAccessMiddleware, categoriesController.change)


router.post('',
    body('name').matches(/^[А-яa-z,. '-]+$/),
    body('link').matches(/^[^0-9а-яА-я]+$/),
    body('order').isNumeric(),
    validationMiddleware,
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    categoriesController.add)


export default router