import { apiService, router } from '../../common.modules.js'

class OrdersModel {
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

export const ordersConfig = {
    'router': {
        general: '/admin/sales/orders',
        edit: '/admin/sales/orders/edit?id=',
    },
    'states': {
        general: 'orders',
        edit: "orders/edit",
    }
}

export default new OrdersModel()