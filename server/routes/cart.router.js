import { Router } from 'express'
import cartController from '../controllers/cart.controller.js'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'

const router = new Router()


router.post('', authAccessMiddleware, csrfTokenMiddleware, cartController.addProduct)
router.get('', authAccessMiddleware, csrfTokenMiddleware, cartController.getUserCart)
router.put('', authAccessMiddleware, csrfTokenMiddleware, cartController.changeProductCount)
router.delete('', authAccessMiddleware, csrfTokenMiddleware, cartController.deleteProduct)
router.post('/get-products', cartController.getProductsByIDs)


export default router