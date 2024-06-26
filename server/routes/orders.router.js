import { Router } from 'express'
import ordersController from '../controllers/orders.controller.js'
import { body } from 'express-validator'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'
import validationMiddleware from '../middlewares/validation.middleware.js'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import adminAccessMiddleware from '../middlewares/admin.middleware.js'

const router = new Router()

router.post('',
    csrfTokenMiddleware,
    body('email').escape().isEmail(),
    body('firstName').escape().exists().matches(/^[А-яa-z ,.'-]+$/).not().matches(/\d/),
    body('tel').escape().isLength({ min: 18, max: 18 }),
    validationMiddleware,
    ordersController.addOrder
)

router.put('',
    body('email').escape().isEmail(),
    body('firstName').escape().exists().matches(/^[А-яa-z ,.'-]+$/).not().matches(/\d/),
    body('lastName').escape().exists().matches(/^[А-яa-z ,.'-]+$/).not().matches(/\d/),
    body('tel').escape().isLength({ min: 18, max: 18 }),
    body('delivery').escape().isBoolean(),
    body('promo').escape().isBoolean(),
    body('payment').escape().isIn(['getting','call']),
    body('status').escape().isIn(
        ['Отменён','Сделка завершена','В процессе','В обработке','all']
    ),
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    validationMiddleware,
    ordersController.change)

router.get('',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    ordersController.getOrders
)

router.get('/count-orders',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    ordersController.countOrders
)

router.get('/count-sales',
    csrfTokenMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    ordersController.countSales
)

router.delete('',
    csrfTokenMiddleware,
    validationMiddleware,
    authAccessMiddleware,
    adminAccessMiddleware,
    ordersController.delete
)


export default router
