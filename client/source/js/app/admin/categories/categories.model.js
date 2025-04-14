import { apiService, router } from '../../common.modules.js'

class CategoriesModel {
    async find() {
        return await apiService.useRequest(router.categoriesLinkParams)
    }
    async findAll() {
        return await apiService.useRequest(router.categoriesLink)
    }
}

export const categoriesConfig = {
    'router': {
        general: '/admin/content/categories',
        edit: '/admin/content/categories/edit?id=',
        add: '/admin/content/categories/add'
    },
    'states': {
        general: 'categories',
        add: "categories/add",
        edit: "categories/edit",
    }
}

export default new CategoriesModel()