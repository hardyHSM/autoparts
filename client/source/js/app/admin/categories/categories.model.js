import { apiService, router } from '../../common.modules.js'

class CategoriesModel {
    constructor(config) {
    }

    async getAll() {
        const res = await apiService.useRequest(router.categoriesLink)
        return res
    }

    async getOne(id) {
        const res = await apiService.useRequest(router.getCategoryLink(id))
        return res
    }
}

export default new CategoriesModel()