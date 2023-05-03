import { apiService, router } from '../../common.modules.js'

class ProductsModel {
    async get() {
        const res = await apiService.useRequest(router.productsLinkWithParams)
        return res
    }
    async getAllDescriptions() {
        const res = await apiService.useRequest(router.productsDescriptionsLink)
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
}

export default new ProductsModel()