import { apiService, router } from '../../common.modules.js'

class SubcategoriesModel {
    async getAll() {
        const res = await apiService.useRequest(router.subcategoriesLink)
        return res
    }
    async getOne(id) {
        const res = await apiService.useRequest(router.getSubcategoryLink(id))
        return res
    }
}

export default new SubcategoriesModel()