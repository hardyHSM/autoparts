import { Router } from 'express'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import adminAccessMiddleware from '../middlewares/admin.middleware.js'
import productController from '../controllers/product.controller.js'

const router = new Router()


router.get('/products_stocks',
    authAccessMiddleware,
    adminAccessMiddleware,
    productController.getAllStocks)


router.get('/products_descriptions',
    authAccessMiddleware,
    adminAccessMiddleware,
    productController.getAllDescriptions)

router.get('/products_providers',
    authAccessMiddleware,
    adminAccessMiddleware,
    productController.getAllProviders)

export default router