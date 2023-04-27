import { Router } from 'express'
import catalogController from '../controllers/catalog.controller.js'


const router = new Router()

router.get('/list', catalogController.getList)
router.get(['/:category', '/:category/:subcategory'], catalogController.getProducts)


export default router