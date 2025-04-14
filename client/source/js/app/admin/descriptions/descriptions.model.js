import { apiService, router } from '../../common.modules.js'

class DescriptionsModel {
    async find () {
        return await apiService.useRequest(router.productsDescriptionsLinkParams)
    }
    async findAll() {
        return await apiService.useRequest(router.productsDescriptionsLink)
    }
    async search(value) {
        return await apiService.useRequest(router.productsDescriptionsSearchTitle(value))
    }

    async getId(id) {
        return await apiService.useRequest(router.productsDescriptionsSearchId(id))
    }
}

export const descriptionsConfig = {
    'router': {
        general: '/admin/content/products_description',
        edit: '/admin/content/products_description/edit?id=',
        add: '/admin/content/products_description/add',
    },
    'states': {
        general: 'products_description',
        add: "products_description/add",
        edit: "products_description/edit",
    }
}



export default new DescriptionsModel()