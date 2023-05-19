import { apiService, router } from '../../common.modules.js'

class ProductsModel {
    async find() {
        const res = await apiService.useRequest(router.productsLinkParams)
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

export default new ProductsModel()