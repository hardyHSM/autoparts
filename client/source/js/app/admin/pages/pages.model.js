import { apiService, router } from '../../common.modules.js'

class PagesModel {
    async find() {
        return await apiService.useRequest(router.pageParamsLink)
    }
}

export const pagesConfig = {
    'states': {
        general: 'pages',
        add: 'pages/add',
        edit: 'pages/edit'
    },
    'router': {
        general: '/admin/content/pages',
        add: '/admin/content/pages/add',
        edit: '/admin/content/pages/edit?id='
    }
}


export default new PagesModel()