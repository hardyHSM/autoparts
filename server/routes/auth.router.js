import { body } from 'express-validator'
import { Router } from 'express'
import userController from '../controllers/user.controller.js'
import authAccessMiddleware from '../middlewares/auth.access.middleware.js'
import csrfTokenMiddleware from '../middlewares/csrf.token.middleware.js'
import validationMiddleware from '../middlewares/validation.middleware.js'

const router = new Router()


router.post(
    '/registration',
    body('email').escape().isEmail().trim(),
    body('firstName').trim().escape().exists().matches(/^[ЁёА-я ]+$/).not().matches(/\d/),
    body('lastName').escape().trim(),
    body('password').escape().isLength({ min: 6, max: 32 }),
    body('tel').escape().isLength({ min: 18, max: 18 }),
    validationMiddleware,
    userController.registration
)
router.patch('/change',
    body('email').escape().isEmail().trim(),
    body('firstName').escape().trim().exists().matches(/^[А-яa-z ,.'-]+$/).not().matches(/\d/),
    body('lastName').escape(),
    body('tel').escape().isLength({ min: 18, max: 18 }),
    authAccessMiddleware,
    csrfTokenMiddleware,
    validationMiddleware,
    userController.changeProfile
)

router.post('/recovery-password',
    body('password').escape().isLength({ min: 6, max: 32 }),
    body('repassword').escape().isLength({ min: 6, max: 32 }),
    validationMiddleware,
    userController.recoveryPassword
)

router.post('/change-password',
    body('prevPassword').escape().isLength({ min: 6, max: 32 }),
    body('newPassword').escape().isLength({ min: 6, max: 32 }),
    authAccessMiddleware,
    csrfTokenMiddleware,
    validationMiddleware,
    userController.changePassword
)

router.post('/login',
    body('email').escape(),
    body('password').escape(),
    userController.login
)

router.post('/pass-recovery',
    body('email').escape().isEmail().trim(),
    validationMiddleware,
    userController.passwordRecovery
)
router.get('/pass-recovery/:link', userController.passwordChangeLink)
router.get('/activate/:link', userController.activate)
router.post('/logout', authAccessMiddleware, csrfTokenMiddleware, userController.logout)
router.get('/info', userController.info)
router.get('/orders', authAccessMiddleware, csrfTokenMiddleware, userController.getOrders)
router.get('/notifications', authAccessMiddleware, csrfTokenMiddleware, userController.getNotifications)

export default router