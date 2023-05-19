import OrdersModel from '../models/orders.model.js'
import UsersModel from '../models/users.model.js'
import DescriptionsModel from '../models/descriptions.model.js'
import ApiError from '../service/error.service.js'

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

    async getOrders(req, res, next) {
        try {
            const id = req.query?.id
            if (!id) {
                const page = req.query.page || 1
                const status = req.query.status
                const sortName = req.query.sort_name || 'price'
                const sortType = req.query.sort_type || 1
                const sortData = {
                    [sortName]: sortType
                }
                const params = {}
                if (status && status !== 'all') {
                    params.status = status
                }
                const [descriptions, count] = await Promise.all([
                    OrdersModel
                    .find(params)
                    .sort(sortData)
                    .limit(30)
                    .skip((page - 1) * 30)
                    .lean(),
                    OrdersModel.find(params).count().lean()
                ])

                res.json({ list: descriptions, count })
            } else {
                const description = await OrdersModel.findById(id).populate('products.product')
                res.json(description)
            }

        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.body
            const result = await OrdersModel.findByIdAndDelete(id)
            if (!result) {
                return res.json({
                    success: 'Что-то пошло не так'
                })
            }
            res.json({
                success: 'Заказ успешно удален.'
            })
        } catch (e) {
            next(e)
        }
    }

    async change(req, res, next) {
        try {
            const { id, ...rest } = req.body
            const order = await OrdersModel.findById(id)
            if (!order) {
                next(ApiError.BadRequest('Заказ не найден!'))
            }
            for ( const key in rest ) {
                if (key in order) {
                    order[key] = rest[key]
                }
            }
            await order.save()
            res.json({
                success: 'Заказ успешно изменён.'
            })
        } catch (e) {
            next(e)
        }
    }

    async countSales(req, res, next) {
        try {
            const count = await OrdersModel.find({ status: 'Сделка завершена' }).count()
            res.json(count)
        } catch (e) {
            next(e)
        }
    }

    async countOrders(req, res, next) {
        try {
            const count = await OrdersModel.find({ status: {'$nin': ['Сделка завершена']} }).count()
            res.json(count)
        } catch (e) {
            next(e)
        }
    }
}

const ordersController = new OrdersController()

export default ordersController