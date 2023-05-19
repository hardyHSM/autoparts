import { apiService, router } from '../../common.modules.js'

class DescriptionsModel {
    async find () {
        return await apiService.useRequest(router.productsDescriptionsLinkParams)
    }
    async findAll() {
        return await apiService.useRequest(router.productsDescriptionsLink)
    }
    async search(value) {
        return await apiService.useRequest(router.productsDescriptionsSearch(value))
    }
}

export default new DescriptionsModel()