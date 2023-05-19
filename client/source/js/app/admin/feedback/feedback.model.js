import { apiService, router } from '../../common.modules.js'

class FeedbackModel {
    async find() {
        return await apiService.useRequest(router.feedBackLinkParams)
    }
}

export default new FeedbackModel()