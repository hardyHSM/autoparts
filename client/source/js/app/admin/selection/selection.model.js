import { apiService, router } from '../../common.modules.js'

class SelectionModel {
    async find() {
        return await apiService.useRequest(router.selectionLinkParams)
    }
}

export default new SelectionModel()