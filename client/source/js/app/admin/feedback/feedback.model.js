import { apiService, router } from '../../common.modules.js'

class FeedbackModel {
    async find() {
        return await apiService.useRequest(router.feedBackLinkParams)
    }
}

export const feedbackConfig = {
    'router': {
        general: '/admin/users/feedback',
        edit: '/admin/users/feedback/edit?id=',
    },
    'states': {
        general: 'feedback',
        edit: "feedback/edit",
    }
}

export default new FeedbackModel()