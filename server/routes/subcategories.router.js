import { Router } from 'express'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import adminAccessMiddleware from '../middlewares/admin.middleware.js'
import { body } from 'express-validator'
import validationMiddleware from '../middlewares/validation.middleware.js'
import subcategoriesController from '../controllers/subcategories.controller.js'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'

const router = new Router()

router.get('', csrfTokenMiddleware,authAccessMiddleware, adminAccessMiddleware, subcategoriesController.get)
router.delete('', csrfTokenMiddleware,authAccessMiddleware, adminAccessMiddleware, subcategoriesController.delete)
router.put('',
    body('id').escape(),
    body('name').matches(/^[А-яa-z,. '-]+$/),
    body('link').matches(/^[^0-9а-яА-я]+$/),
    body('category').escape(),
    csrfTokenMiddleware,
    validationMiddleware,
    authAccessMiddleware, adminAccessMiddleware, subcategoriesController.change)

router.post('',
    body('name').matches(/^[А-яa-z,. '-]+$/),
    body('link').matches(/^[^0-9а-яА-я]+$/),
    body('category').escape(),
    csrfTokenMiddleware,
    validationMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    subcategoriesController.add)


export default router