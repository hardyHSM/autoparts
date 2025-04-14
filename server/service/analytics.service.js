import OrdersModel from '../models/orders.model.js'


class AnalyticsService {
    async init() {
        this.minimum = new Date(await this.getMinimumTimeLimit())
    }

    async getMinimumTimeLimit() {
        const minTimestampList = await OrdersModel.aggregate([
            {
                $group: {
                    _id: null,
                    date: { $min: '$createdAt' }
                }
            },
            {
                $project: {
                    date: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$date',
                            timezone: 'Europe/Moscow'
                        }
                    }
                }
            }
        ])
        return minTimestampList[0].date
    }

    async getCommonInfo() {
        const completedDeals = await OrdersModel.find({ status: 'Сделка завершена' })
        const dealsCount = completedDeals.length
        const revenue = completedDeals.reduce((acc, deal) => acc + deal.total, 0)
        const averageTotal = Math.floor(revenue / dealsCount)

        const productsCount = completedDeals.reduce((acc, deal) => {
            return acc + deal.products.reduce((a, p) => {
                return a + p.count
            }, 0)
        }, 0)

        // const minTimestamp = await this.getMinimumTimeLimit()

        return {
            revenue,
            dealsCount,
            averageTotal,
            productsCount,
            minTimestamp: this.minimum
        }
    }

    async getCategoryStats(date) {
        const data = await OrdersModel.aggregate([
            {
                $match: {
                    status: 'Сделка завершена',
                    createdAt: { $gte: date.startDay, $lte: date.endDay }
                }
            },
            { $unwind: '$products' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $group: {
                    _id: '$productInfo.category',
                    total: { $sum: { $multiply: ['$products.count', '$products.price'] } },
                    totalCount: { $sum: '$products.count' }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { $unwind: '$categoryInfo' },
            {
                $project: {
                    _id: 1,
                    key: '$categoryInfo.name',
                    total: 1,
                    totalCount: 1
                }
            }
        ])


        const totalProductCount = data.reduce((sum, cat) => sum + cat.totalCount, 0)


        return data.map(cat => ({
            key: cat.key,
            total: cat.total,
            totalCount: cat.totalCount,
            popularity: totalProductCount > 0
                ? `${(cat.totalCount / totalProductCount) * 100}` : '0'
        }))
    }

    async getSubcategoryStats(date) {
        const data = await OrdersModel.aggregate([
            {
                $match: {
                    status: 'Сделка завершена',
                    createdAt: { $gte: date.startDay, $lte: date.endDay }
                }
            },
            { $unwind: '$products' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $group: {
                    _id: '$productInfo.subcategory',
                    total: { $sum: { $multiply: ['$products.count', '$products.price'] } },
                    totalCount: { $sum: '$products.count' }
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'subcategoryInfo'
                }
            },
            { $unwind: { path: '$subcategoryInfo', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'categories',
                    let: { categoryId: '$subcategoryInfo.category' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', { $toObjectId: '$$categoryId' }]
                                }
                            }
                        }
                    ],
                    as: 'categoryInfo'
                }
            },
            { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    key: '$subcategoryInfo.name',
                    category: '$categoryInfo.name',
                    total: 1,
                    totalCount: 1
                }
            }
        ])

        const totalProductCount = data.reduce((sum, cat) => sum + cat.totalCount, 0)


        return data.map(cat => ({
            category: cat.category,
            key: cat.key,
            total: cat.total,
            totalCount: cat.totalCount,
            popularity: totalProductCount > 0
                ? `${(cat.totalCount / totalProductCount) * 100}` : '0'
        }))
    }

    async getSalesStatus(date) {
        const data = await OrdersModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: date.startDay, $lte: date.endDay }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$count' },
                    statuses: { $push: { status: '$_id', count: '$count' } }
                }
            },
            {
                $unwind: '$statuses'
            },
            {
                $project: {
                    _id: 0,
                    status: '$statuses.status',
                    count: '$statuses.count',
                    percentage: { $multiply: [{ $divide: ['$statuses.count', '$total'] }, 100] }
                }
            },
            {
                $sort: { status: 1 }
            }
        ])

        const total = data.reduce((sum, s) => sum + s.count, 0)


        return {
            total,
            list: data
        }

    }

    async getAverageRunTime(date) {
        const res = await OrdersModel.aggregate([
            {
                $match: {
                    status: 'Сделка завершена',
                    createdAt: { $gte: date.startDay, $lte: date.endDay }
                }
            },
            {
                $project: {
                    timeDifference: {
                        $subtract: ['$closeTime', '$createdAt']
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgTimeDifference: { $avg: '$timeDifference' }
                }
            }
        ])
        const ms = Math.floor(res[0]?.avgTimeDifference || 0)
        const seconds = Math.floor(ms / 1000)
        const days = Math.floor(seconds / (24 * 3600))
        const hours = Math.floor((seconds % (24 * 3600)) / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)

        return { days, hours, minutes }
    }

    calculatePercentageDifference = (current, previous) => {
        if (previous === 0) return current === 0 ? 0 : 100
        return Math.floor(((current - previous) / previous) * 100)
    }

    getSum(array, key) {
        return array.reduce((accumulator, currentValue) => accumulator + currentValue[key], 0)
    }

    getAverage(array, key, n, round = true) {
        if (!array.length) return 0
        const sum = array.reduce((accumulator, currentValue) => accumulator + currentValue[key], 0)
        return round ? Math.floor(sum / n) : sum / n
    }

    getPeriodLength(range) {
        return range.endDay.getTime() - range.startDay.getTime()
    }

    parseTimeOffset(range, offset = true) {
        const moscowOffset = offset ? 3 * 60 * 60 * 1000 : 0
        const dayTime = 86400000

        return {
            startDay: new Date(+range[0] + moscowOffset),
            endDay: new Date(+range[1] + moscowOffset + dayTime)
        }
    }

    getPreviousRange(range, inUnixTime) {
        const date = this.parseTimeOffset(range)
        const periodLength = this.getPeriodLength(date)

        const start = date.startDay.getTime() - periodLength
        const end = date.endDay.getTime() - periodLength

        const previousDate = {
            startDay: new Date(start),
            endDay: new Date(end)
        }

        if (previousDate.startDay <= this.minimum) {
            return null
        }

        return inUnixTime ? [start, end] : previousDate
    }

    getDaysCount(range) {
        return Math.ceil((range.endDay - range.startDay) / (1000 * 3600 * 24))
    }

    splitPreviousPeriods(range) {
        const previousPeriods = []
        const date = this.parseTimeOffset(range)
        const periodLength = this.getPeriodLength(date)

        for ( let i = 1; i < 10; i++ ) {
            const startDay = new Date(date.startDay.getTime() - (periodLength * i))
            const endDay = new Date(date.endDay.getTime() - (periodLength * i))
            if (startDay >= this.minimum) {
                previousPeriods.push({ startDay, endDay })
            }
        }
        return previousPeriods
    }

    getSalesCommonData(range) {
        return OrdersModel.aggregate([
            {
                $match: {
                    status: 'Сделка завершена',
                    createdAt: {
                        $gte: range.startDay,
                        $lte: range.endDay
                    }
                }
            },
            {
                $project: {
                    total: 1,
                    totalCount: { $sum: '$products.count' },
                    date: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    }
                }
            },
            {
                $group: {
                    _id: '$date',
                    totalSum: { $sum: '$total' },
                    totalCount: { $sum: '$totalCount' },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    key: '$_id',
                    totalSum: 1,
                    totalCount: 1,
                    orderCount: 1,
                    avgTotalPerOrder: {
                        $cond: {
                            if: { $eq: ['$orderCount', 0] },
                            then: 0,
                            else: { $divide: ['$totalSum', '$orderCount'] }
                        }
                    }
                }
            },
            {
                $sort: { key: 1 }
            }
        ])
    }

    async getPotentialRevenueByStatus(range) {
        const res = await OrdersModel.aggregate([
            {
                $match: {
                    status: { $in: ['В процессе', 'Не обработан'] },
                    createdAt: {
                        $gte: range.startDay,
                        $lte: range.endDay
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSum: { $sum: '$total' }
                }
            }

        ])
        return res[0]?.totalSum || 0
    }

    async getPopularProducts(range) {
        return await OrdersModel.aggregate([
            {
                $match: {
                    status: 'Сделка завершена',
                    createdAt: {
                        $gte: range.startDay,
                        $lte: range.endDay
                    }
                }
            },
            { $unwind: '$products' },
            {
                $group: {
                    _id: '$products.product',
                    totalSold: { $sum: '$products.count' },
                    totalRevenue: { $sum: { $multiply: ['$products.count', '$products.price'] } }
                }
            },
            { $sort: { totalSold: -1, totalRevenue: -1 } },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            { $limit: 10 }
        ])
    }

    async getPotentialRevenueByDynamic(range, days, avT, avCS) {
        const previousPeriods = this.splitPreviousPeriods(range)
        const requests = previousPeriods.map(period => {
            return this.getSalesCommonData(period)
        })
        const results = await Promise.all(requests)

        const averageTotalsArray = results.map(period => {
            const total = this.getSum(period, 'orderCount')
            return this.getAverage(period, 'totalSum', total, false)
        })
        const averageOrdersCountArray = results.map(period => this.getAverage(period, 'orderCount', days, false))

        const differenceAverageTotal = averageTotalsArray.reduce((acc, val) => this.calculatePercentageDifference(avT, val) / 100, 0) / averageTotalsArray.length || 0
        const differenceAverageSalesCount = averageOrdersCountArray.reduce((acc, val) => this.calculatePercentageDifference(avCS, val) / 100, 0) / averageOrdersCountArray.length || 0


        return Math.floor((avT * avCS * days) * (1 + differenceAverageTotal || 0) * (1 + differenceAverageSalesCount))
    }

    async getRangeInfo(range) {
        const date = this.parseTimeOffset(range)
        const previousDate = this.getPreviousRange(range)
        const days = this.getDaysCount(date)


        const [
            sales,
            previousSales,
            averageRunTime,
            categoryStats,
            subcategoryStats,
            statusSales,
            potentialRevenueByStatus,
            popularProducts
        ] = await Promise.all([
            this.getSalesCommonData(date),
            previousDate ? this.getSalesCommonData(previousDate) : [],
            this.getAverageRunTime(date),
            this.getCategoryStats(date),
            this.getSubcategoryStats(date),
            this.getSalesStatus(date),
            this.getPotentialRevenueByStatus(date),
            this.getPopularProducts(date)
        ])


        const revenueTotal = this.getSum(sales, 'totalSum')
        const productsTotal = this.getSum(sales, 'totalCount')
        const ordersTotal = this.getSum(sales, 'orderCount')
        const previousOrdersTotal = this.getSum(previousSales, 'orderCount')
        const previousRevenueSum = this.getSum(previousSales, 'totalSum')
        const previousProductsSum = this.getSum(sales, 'totalCount')


        const averageTotal = this.getAverage(sales, 'totalSum', ordersTotal)
        const averageSalesCount = this.getAverage(sales, 'orderCount', days, false)
        const averageProductCount = this.getAverage(sales, 'totalCount', ordersTotal)
        const previousAverageTotal = this.getAverage(previousSales, 'totalSum', previousOrdersTotal)
        const previousAverageProductCount = this.getAverage(previousSales, 'totalCount', previousOrdersTotal)


        const differenceRevenue = previousDate ? this.calculatePercentageDifference(revenueTotal, previousRevenueSum) : 0
        const differenceProducts = previousDate ? this.calculatePercentageDifference(productsTotal, previousProductsSum) : 0
        const differenceAverageTotal = previousDate ? this.calculatePercentageDifference(averageTotal, previousAverageTotal) : 0
        const differenceAverageCount = previousDate ? this.calculatePercentageDifference(averageProductCount, previousAverageProductCount) : 0


        const potentialRevenueByProfit = await this.getPotentialRevenueByDynamic(range, days, averageTotal, averageSalesCount)

        return {
            popularProducts,
            sales,
            revenueTotal,
            productsTotal,
            differenceRevenue,
            differenceProducts,
            differenceAverageTotal,
            differenceAverageCount,
            categoryStats,
            subcategoryStats,
            statusSales,
            averageTotal,
            averageProductCount,
            potentialRevenueByProfit,
            potentialRevenueByStatus,
            days,
            averageRunTime
        }
    }
}


const analyticsService = new AnalyticsService()
analyticsService.init()
export default analyticsService