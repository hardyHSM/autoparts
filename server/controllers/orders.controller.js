import OrdersModel from '../models/orders.model.js'
import UsersModel from '../models/users.model.js'
import DescriptionsModel from '../models/descriptions.model.js'
import ApiError from '../service/error.service.js'
import analyticsService from '../service/analytics.service.js'
import LocationsModel from '../models/locations.model.js'
import ProductsModel from '../models/products.model.js'

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
                order.user = user
                user.orders.push(order)

                user.notifications.push({
                    messageType: 'info',
                    message: `Вы оставили заказ на нашем сайте. Посмотреть его можно здесь - 
                            <a href="/user/purchases/orders?id=${order._id}">посмотреть</a>
                    `,
                    createdTime: new Date()
                })

                await order.save()
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
            if (!('id' in req.query)) {
                const page = req.query.page || 1
                const status = req.query.status
                const sortName = req.query.sort_name || 'createdAt'
                const sortType = req.query.sort_type || -1
                const sortData = {
                    [sortName]: sortType
                }

                const minimum = new Date(await analyticsService.getMinimumTimeLimit())
                const range = analyticsService.parseTimeOffset([req.query.from || minimum, req.query.to || new Date().getTime()], false)
                const params = {
                    createdAt: {
                        $gte: range.startDay,
                        $lte: range.endDay
                    }
                }
                if (status && status !== 'all') {
                    params.status = status
                }

                const [orders, total, countProducts, count, minDate] = await Promise.all([
                    OrdersModel
                    .find(params)
                    .sort(sortData)
                    .limit(30)
                    .skip((page - 1) * 30)
                    .lean(),
                    OrdersModel.aggregate([
                        {
                            $match: {
                                ...params
                            }
                        },
                        {
                            $group: {
                                _id: 0,
                                total: { $sum: '$total' }
                            }
                        }
                    ]),
                    OrdersModel.aggregate([
                        { $match: params },
                        { $unwind: '$products' },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: '$products.count' }
                            }
                        }
                    ]),
                    OrdersModel.find(params).count(),
                    analyticsService.getMinimumTimeLimit()
                ])


                res.json({
                    list: orders,
                    count,
                    countProducts: countProducts[0]?.count || 0,
                    total: total[0]?.total || 0,
                    minDate
                })
            } else {
                const description = await OrdersModel.findById(id).populate(['products.product','location'])
                res.json(description)
            }

        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.body
            const order = await OrdersModel.findById(id)
            const user = await UsersModel.findById(order.user)

            if(user) {
                user.orders = user.orders.filter(order => !order.equals(id))
                await user.save()
            }
            await OrdersModel.findByIdAndDelete(id)
            res.json({
                message: 'Заказ успешно удален.'
            })
        } catch (e) {
            next(e)
        }
    }

    async change(req, res, next) {
        try {
            const { id, ...rest } = req.body
            const order = await OrdersModel.findById(id).populate(['products.product'])
            if (!order) {
                next(ApiError.BadRequest('Заказ не найден!'))
            }
            for ( const key in rest ) {
                if (key in order) {
                    if(key === 'location') {
                        rest[key] = await LocationsModel.findById(rest[key])
                    }
                    order[key] = rest[key]
                }
            }
            if(order.status === 'Сделка завершена') {
                order.closeTime = new Date()
                for (const item of order.products) {
                     const res = await ProductsModel.updateOne(
                        { _id: item.product.id },
                        { $inc: { popularity: item.count } }
                    );
                }
            }
            await order.save()
            res.json({
                message: 'Заказ успешно изменён.'
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
            const count = await OrdersModel.find({ status: { '$nin': ['Сделка завершена'] } }).count()
            res.json(count)
        } catch (e) {
            next(e)
        }
    }
}

const ordersController = new OrdersController()

export default ordersController