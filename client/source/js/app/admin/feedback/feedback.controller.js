import { apiService, auth, router } from '../../common.modules.js'
import feedbackModel, { feedbackConfig } from './feedback.model.js'
import PaginationComponent from '../../../core/components/pagination.component.js'
import scrollToTop, { getTemplateMailFeedback, parseArrayToHTML } from '../../utils/utils.js'
import SortProvider from '../../../core/providers/sort.provider.js'
import FilterProvider from '../../../core/providers/filter.provider.js'
import FeedbackForm from './feedback.form.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'
import { subcategoriesConfig } from '../subcategories/subcategories.model.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'
import contentEditor from '../../../core/components/contentEditor.js'

class FeedbackController {
    async middleware() {
        let page = router.getParam('page')
        if (!page) {
            page = 1
            router.addParams('page', page)
            router.redirectUrlState()
        }
        const feedbacks = await feedbackModel.find()
        return {
            feedbacks,
            page
        }
    }

    async middlewareEdit() {
        const data = await feedbackModel.find()
        if(data.message) throw new Error()
        return data
    }

    async functional(_, data, module) {
        const pagination = new PaginationComponent({
            query: '#pagination', onChange: async (pageNumber) => {
                router.addParams('page', pageNumber)
                router.redirectUrlState()
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        })
        pagination.render({
            currentPage: data.page, count: data.feedbacks.count, limit: 20
        })
        new SortProvider({
            root: '[data-sort-header]',
            default: 'createdAt',
            router, changeStateHandler: async (key, type) => {
                router.addParams('sort_name', key)
                router.addParams('sort_type', type)
                router.redirectUrlState()
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        }).init()
        new FilterProvider({
            root: '[data-filter-bar]', router, onChangeState: async () => {
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        }).init()
    }
    functionalEdit(_, data, module) {
        if(!data.isAnswered) {
            contentEditor('#editor', getTemplateMailFeedback(data), 'editor-content')
            new FeedbackForm({
                method: 'PUT',
                title: 'Ответ на вопрос от пользователя',
                submitSelector: '[data-submit]',
                form: '[data-admin-form]',
                router,
                auth,
                apiService,
                editor,
                onSubmit: () => {
                    router.redirectUrlState(feedbackConfig.router.general)
                    module.changeState()
                }
            }).init()
        }
        DeleteHelper.delete({
            selector: '[data-feedback-delete]',
            title: 'Удаление вопроса',
            text: 'Вы действительно хотите удалить этот вопрос?',
            routerLink: router.feedBackLink,
            id: data._id,
            closeOnSubmit: false,
            onSubmit: (res) => {
                if (res.status === 200) {
                    router.setPrevState()
                }
                new ModalComponent({
                    template: 'default',
                    title: 'Удаление вопроса от пользователя',
                    text: res.data.message
                }).create()
            }
        })
    }
}


export default new FeedbackController()