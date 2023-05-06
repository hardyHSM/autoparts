import { apiService, router } from '../../common.modules.js'

class ProductsModel {
    async get() {
        const res = await apiService.useRequest(router.productsLinkWithParams)
        return res
    }
    async search(value) {
        const res = await apiService.useRequest(router.getSearchProducts(value))
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