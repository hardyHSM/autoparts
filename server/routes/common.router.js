import { Router } from 'express'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import adminAccessMiddleware from '../middlewares/admin.middleware.js'
import productController from '../controllers/product.controller.js'
import { body } from 'express-validator'
import { escapeRegExpValidator } from '../utils/validators.js'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'

const router = new Router()


router.get('/products_stocks',
    authAccessMiddleware,
    adminAccessMiddleware,
    csrfTokenMiddleware,
    productController.getAllStocks)


router.get('/products_descriptions',
    authAccessMiddleware,
    adminAccessMiddleware,
    csrfTokenMiddleware,
    productController.getAllDescriptions)


router.put('/products_descriptions',
    body('title').exists().trim().custom(escapeRegExpValidator),
    authAccessMiddleware,
    adminAccessMiddleware,
    csrfTokenMiddleware,
    productController.changeProductDescription)

router.delete('/products_descriptions',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    productController.deleteProductDescription)

router.post('/products_descriptions',
    body('title').exists().trim().custom(escapeRegExpValidator),
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    productController.addProductDescription)


router.get('/products_providers',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    productController.getAllProviders)

router.get('/products_makers',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    productController.getAllMakers)

export default router