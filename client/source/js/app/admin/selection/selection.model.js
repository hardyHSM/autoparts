import { apiService, router } from '../../common.modules.js'

class SelectionModel {
    async find() {
        return await apiService.useRequest(router.selectionLinkParams)
    }
}


export const selectionConfig = {
    'router': {
        general: '/admin/users/selection',
        edit: '/admin/users/selection/edit?id=',
    },
    'states': {
        general: 'selection',
        edit: 'selection/edit'
    }
}

export default new SelectionModel()