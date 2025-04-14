import CategoriesModel from '../models/categories.model.js'
import ApiError from '../service/error.service.js'
import OrdersModel from '../models/orders.model.js'
import analyticsService from '../service/analytics.service.js'

class AnalyticsController {
    async getInfo(req, res, next) {
        try {
            const query = req.query
            if (query.from && query.to) {
                const result = await analyticsService.getRangeInfo([query.from, query.to])
                res.json(result)
            } else {
                const result = await analyticsService.getCommonInfo()
                res.json(result)
            }
        } catch (e) {
            next(e)
        }
    }

}

const analyticsController = new AnalyticsController()


export default analyticsController