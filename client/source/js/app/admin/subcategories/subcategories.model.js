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


export const subcategoriesConfig = {
    'router': {
        general: '/admin/content/subcategories',
        edit: '/admin/content/subcategories/edit?id=',
        add: '/admin/content/subcategories/add'
    },
    'states': {
        general: 'subcategories',
        add: "subcategories/add",
        edit: "subcategories/edit",
    }
}

export default new SubcategoriesModel()