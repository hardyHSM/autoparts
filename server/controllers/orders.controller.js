import OrdersModel from '../models/orders.model.js'
import ApiError from '../service/error.service.js'
import { validationResult } from 'express-validator'
import UsersModel from '../models/users.model.js'

class OrdersController {
    async addOrder(req, res, next) {
        try {
            let { products, ...userData } = req.body

            products = products.map(item => {
                item.product = item.product._id
                return item
            })

            const candidateOrder = {
                products,
                ...userData
            }

           const order = await OrdersModel.create(candidateOrder)

            if (req.user) {
                let user = await UsersModel.findById(req.user.id)
                user.orders.push(order)

                user.notifications.push({
                    messageType: 'info',
                    message: `Вы оставили заказ на нашем сайте. Посмотреть его можно здесь - 
                            <a href="/user/purchases/orders?id=${order._id}">посмотреть</a>
                    `,
                    createdTime: new Date()
                })

                await user.save()
            }

            res.status(200).json({
                message: 'Заказ успешно добавлен'
            })
        } catch (e) {
            next(e)
        }
    }

}

const ordersController = new OrdersController()

export default ordersController