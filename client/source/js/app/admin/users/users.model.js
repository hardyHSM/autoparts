import { apiService, router } from '../../common.modules.js'

class UsersModel {
    async find() {
        return await apiService.useRequest(router.usersLinkParams)
    }
    async findAll() {
        return await apiService.useRequest(router.usersLink)
    }
}

export default new UsersModel()