import { Router } from 'express'
import searchController from '../controllers/search.controller.js'


const router = new Router()


router.options('', searchController.searchOptions)
router.options('/maker', searchController.searchMaker)
router.options('/attributes', searchController.searchAttributes)


export default router