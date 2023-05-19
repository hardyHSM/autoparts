import { apiService, router } from '../../common.modules.js'

class CategoriesModel {
    async find() {
        return await apiService.useRequest(router.categoriesLinkParams)
    }
    async findAll() {
        return await apiService.useRequest(router.categoriesLink)
    }
}

export default new CategoriesModel()