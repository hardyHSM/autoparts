import { config } from 'dotenv'
import path from 'path'
import express from 'express'
import mongoose from 'mongoose'

import cookieParser from 'cookie-parser'
import errorMiddleware from './middlewares/error.middleware.js'
import authMiddleware from './middlewares/auth.middleware.js'

import authRouter from './routes/auth.router.js'
import locationsRouter from './routes/locations.router.js'
import productRouter from './routes/product.router.js'
import catalogRouter from './routes/catalog.router.js'
import cartRouter from './routes/cart.router.js'
import selectionRouter from './routes/selection.router.js'
import feedbackRouter from './routes/feedback.router.js'
import ordersRouter from './routes/orders.router.js'
import authAccessMiddleware from './middlewares/auth.access.middleware.js'
import searchRouter from './routes/search.router.js'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xssClean from 'xss-clean'
import adminAccessMiddleware from './middlewares/admin.middleware.js'
import ApiError from './service/error.service.js'

config()
global.__dirname = path.dirname('')
global.__basedir = path.resolve(__dirname, '..')
global.__client = path.resolve(__basedir, 'client')


const PORT = process.env.PORT || 5000


class Application {
    app = express()

    start() {
        this.registerMiddlewares()
        this.registerStatic()
        this.registerApiRoutes()
        this.registerStaticPaths()
        this.registerErrors()
        this.startServe()
    }

    registerStatic() {
        this.app.use('*/fonts/', express.static(path.join(__client, 'build', 'fonts')))
        this.app.use('*/img/', express.static(path.join(__client, 'build', 'img')))
        this.app.use('*/js/', express.static(path.join(__client, 'build', 'js')))
        this.app.use('*/css/', express.static(path.join(__client, 'build', 'css')))
    }

    registerMiddlewares() {
        this.app.use(express.json({ limit: '5mb' }))
        this.app.use(helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false
        }))
        this.app.use(cookieParser())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(mongoSanitize({
            allowDots: true,
            onSanitize: ({ req, key }) => {
                console.warn(`This request[${key}] is sanitized`, req.body)
            }
        }))
        this.app.use(xssClean())
        this.app.use(authMiddleware)
    }

    registerApiRoutes() {
        this.app.use('/api/search', searchRouter)
        this.app.use('/api/auth', authRouter)
        this.app.use('/api/order', ordersRouter)
        this.app.use('/api/selection', selectionRouter)
        this.app.use('/api/feedback', feedbackRouter)
        this.app.use('/api/locations', locationsRouter)
        this.app.use('/api/product', productRouter)
        this.app.use('/api/catalog', catalogRouter)
        this.app.use('/api/cart', cartRouter)
    }

    registerStaticPaths() {
        this.app.get('/', (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'index.html'))
        })

        this.app.get(['/admin', '/admin/:link1', '/admin/:link1/:link2'],
            authAccessMiddleware,
            adminAccessMiddleware,
            (req, res, next) => {
               try {
                   res.status(200).sendFile(path.join(__client, 'build', 'admin.html'))
               } catch(e) {
                   next(ApiError.Error404())
               }
            })

        this.app.get('/product/:id', (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'product.html'))
        })

        this.app.get(['/catalog/:category', '/catalog/:category/:subcategory'], (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'catalog.html'))
        })

        this.app.get('/activate/:link', (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'activate.account.html'))
        })

        this.app.get(['/search', '/search/:type'], (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'search.html'))
        })

        this.app.get('/pass-recovery/:link', (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'pass.recovery.html'))
        })

        this.app.get('/page_delivery', (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'delivery.html'))
        })

        this.app.get('/cart', (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'cart.html'))
        })

        this.app.get('/order', (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'order.html'))
        })

        this.app.get('/page_payment', (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'payment.html'))
        })

        this.app.get('/page_contacts', (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'contacts.html'))
        })

        this.app.get('/page_contract_offer', (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'page.contract.offer.html'))
        })

        this.app.get('/page_how_buy', (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'how_buy.html'))
        })

        this.app.get(['/user', '/user/:one', '/user/:one/:two'], authAccessMiddleware, (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'profile.html'))
        })

        this.app.get('/reg', (req, res) => {
            if (req.user) {
                res.status(404).sendFile(path.join(__client, 'build', '404.html'))
            } else {
                res.status(200).sendFile(path.join(__client, 'build', 'reg.html'))
            }
        })

        this.app.get('/page_selection', (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'selection.html'))
        })

        this.app.get('/page_refund_policy', (req, res) => {
            res.status(200).sendFile(path.join(__client, 'build', 'page.refund.policy.html'))
        })

        this.app.use((req, res, next) => {
            res.status(404).sendFile(path.join(__client, 'build', '404.html'))
        })
    }

    registerErrors() {
        this.app.use(errorMiddleware)
    }

    async startDataBase() {
        try {
            const url = process.env.DB_URL
            await mongoose.connect(url)
            console.log('Data base is working!')
        } catch (e) {
            console.error(e.message)
        }
    }

    async startServe() {
        await this.startDataBase()
        this.app.listen(PORT, '0.0.0.0', (err) => {
            if (err) {
                console.log(err)
            }
            console.log(`Server is running on ${process.env.API_URL}`)
        })

    }
}


export default Application


