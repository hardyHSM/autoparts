import { Router } from 'express'
import productController from '../controllers/product.controller.js'


const router = new Router()


router.get('/:productId', productController.getFullProduct)


export default router