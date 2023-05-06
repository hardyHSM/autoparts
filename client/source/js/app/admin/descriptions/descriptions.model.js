import { apiService, router } from '../../common.modules.js'

class DescriptionsModel {
    async getAll() {
        const res = await apiService.useRequest(router.productsDescriptionsLink)
        return res
    }
    async get() {
        const res = await apiService.useRequest(router.productsDescriptionsLinkWithParams)
        return res
    }
}

export default new DescriptionsModel()