import { apiService, router } from '../../common.modules.js'

class SubcategoriesModel {
    async find() {
        const res = await apiService.useRequest(router.subcategoriesLinkParams)
        return res
    }
    async findAll() {
        const res = await apiService.useRequest(router.subcategoriesLink)
        return res
    }
}

export default new SubcategoriesModel()