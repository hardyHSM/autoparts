import { apiService, auth, router } from '../../common.modules.js'
import feedbackModel from './feedback.model.js'
import PaginationComponent from '../../../core/components/pagination.component.js'
import scrollToTop, { getTemplateMailFeedback, parseArrayToHTML } from '../../utils/utils.js'
import SortProvider from '../../../core/providers/sort.provider.js'
import FilterProvider from '../../../core/providers/filter.provide.js'
import { Editor } from '@toast-ui/editor'
import FeedbackForm from './feedback.form.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'

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
        return await feedbackModel.find()
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
            const editor = new Editor({
                el: document.querySelector('#editor'),
                previewStyle: 'vertical',
                height: '500px'
            })
            editor.setHTML(getTemplateMailFeedback(data))
            document.querySelector('.toastui-editor-contents').className = 'editor-content'
            new FeedbackForm({
                method: 'PUT',
                title: 'Ответ на вопрос от пользователя',
                submitSelector: '[data-submit]',
                form: '[data-admin-form]',
                router,
                auth,
                apiService,
                editor,
                onsuccess: () => {
                    router.redirectUrlState('/admin/users/feedback')
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
            onsuccess: () => {
                router.redirectUrlState('/admin/users/feedback')
                module.changeState()
            }
        })
    }
}


export default new FeedbackController()