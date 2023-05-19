import { apiService, router } from '../../common.modules.js'

class SalesModel {
    async find() {
        const res = await apiService.useRequest(router.orderLinkParams)
        return res
    }
    async findAll() {
        const res = await apiService.useRequest(router.orderLink)
        return res
    }
    async countOrders() {
        const res = await apiService.useRequest(router.ordersCountLink)
        return res
    }
    async countSales() {
        const res = await apiService.useRequest(router.salesCountLink)
        return res
    }
}

export default new SalesModel()