import { Router } from 'express'
import categoriesController from '../controllers/categories.controller.js'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import adminAccessMiddleware from '../middlewares/admin.middleware.js'
import { body } from 'express-validator'
import validationMiddleware from '../middlewares/validation.middleware.js'

const router = new Router()

router.get('', authAccessMiddleware, adminAccessMiddleware, categoriesController.get)
router.delete('', authAccessMiddleware, adminAccessMiddleware, categoriesController.delete)

router.put('',
    body('name').matches(/^[А-яa-z,. '-]+$/),
    body('link').matches(/^[^0-9а-яА-я]+$/),
    body('order').isNumeric(),
    validationMiddleware,
    authAccessMiddleware, adminAccessMiddleware, categoriesController.change)


router.post('',
    body('name').matches(/^[А-яa-z,. '-]+$/),
    body('link').matches(/^[^0-9а-яА-я]+$/),
    body('order').isNumeric(),
    validationMiddleware,
    authAccessMiddleware, adminAccessMiddleware, categoriesController.add)


export default router