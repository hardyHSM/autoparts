import { apiService, router } from '../../common.modules.js'

class UsersModel {
    async find() {
        return await apiService.useRequest(router.usersLinkParams)
    }
    async findAll() {
        return await apiService.useRequest(router.usersLink)
    }
}

export const usersConfig = {
    'router': {
        general: '/admin/users',
        edit: '/admin/users/users/edit?id=',
    },
    'states': {
        general: 'users',
        edit: "users/edit",
    }
}

export default new UsersModel()