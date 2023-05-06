import { Router } from 'express'
import productController from '../controllers/product.controller.js'
import validationMiddleware from '../middlewares/validation.middleware.js'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import adminAccessMiddleware from '../middlewares/admin.middleware.js'
import { body } from 'express-validator'


const router = new Router()


router.get('/:productId', productController.getFullProduct)
router.get('', productController.get)
router.delete('', productController.deleteProduct)

router.post('',
    body('title').exists().trim(),
    body('maker').escape().exists().trim(),
    body('provider').escape().exists().trim(),
    body('stock').escape().exists().trim(),
    body('attributes').exists(),
    body('price').escape().isNumeric().trim(),
    body('count').escape().isNumeric().trim(),
    body('popularity').escape().isNumeric().trim(),
    validationMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    productController.add)
router.put('',
    body('title').exists().trim(),
    body('maker').exists().trim(),
    body('provider').escape(),
    body('stock').escape(),
    body('attributes').isObject(),
    body('price').escape().isNumeric(),
    body('count').escape().isNumeric(),
    body('popularity').escape().isNumeric(),
    validationMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    productController.change)


export default router