import { apiService, router } from '../../common.modules.js'

class ProductsModel {
    async find() {
        const res = await apiService.useRequest(router.productsLinkParams)
        return res
    }

    async search(value) {
        const res = await apiService.useRequest(router.productsSearch(value))
        return res
    }

    async findAll() {
        const res = await apiService.useRequest(router.productsLink)
        return res
    }
    async getAllProviders() {
        const res = await apiService.useRequest(router.providerLink)
        return res
    }
    async getAllStocks() {
        const res = await apiService.useRequest(router.stocksLink)
        return res
    }
    async getAllMakers() {
        const res = await apiService.useRequest(router.makersLink)
        return res
    }
}


export const productsConfig = {
    'router': {
        general: '/admin/content/products',
        edit: '/admin/content/products/edit?id=',
        add: '/admin/content/products/add',
        page: '/products/'
    },
    'states': {
        general: 'products',
        add: "products/add",
        edit: "products/edit",
    }
}

export default new ProductsModel()