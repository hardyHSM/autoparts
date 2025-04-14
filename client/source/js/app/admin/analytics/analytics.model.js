import { apiService, router } from '../../common.modules.js'

class AnalyticsModel {
    async get() {
        return await apiService.useRequest(router.analyticsLink)
    }
}

export const analyticsConfig = {
    'router': {
        general: '/admin/sales/analytics'
    },
    'states': {
        general: 'analytics',
    }
}

export default new AnalyticsModel()