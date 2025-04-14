import { apiService, auth, router } from '../../common.modules.js'
import PaginationComponent from '../../../core/components/pagination.component.js'
import scrollToTop, { getTemplateMailFeedback, getTemplateMailSelection, parseArrayToHTML } from '../../utils/utils.js'
import SortProvider from '../../../core/providers/sort.provider.js'
import FilterProvider from '../../../core/providers/filter.provider.js'
import SelectionForm from './selection.form.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'
import selectionModel, { selectionConfig } from './selection.model.js'
import { categoriesConfig } from '../categories/categories.model.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'
import contentEditor from '../../../core/components/contentEditor.js'

class SelectionController {
    async middleware() {
        let page = router.getParam('page')
        if (!page) {
            page = 1
            router.addParams('page', page)
            router.redirectUrlState()
        }
        const selections = await selectionModel.find()
        return {
            selections,
            page
        }
    }

    async middlewareEdit() {
        const data = await selectionModel.find()
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
            currentPage: data.page, count: data.selections.count, limit: 20
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
            contentEditor('#editor', getTemplateMailSelection(data), 'editor-content')
            new SelectionForm({
                method: 'PUT',
                title: 'Ответ на подбор запчастей',
                submitSelector: '[data-submit]',
                form: '[data-admin-form]',
                router,
                auth,
                apiService,
                onSubmit: () => {
                    router.redirectUrlState(selectionConfig.router.general)
                    module.changeState()
                }
            }).init()
        }
        DeleteHelper.delete({
            selector: '[data-feedback-delete]',
            title: 'Удаление подбора',
            text: 'Вы действительно хотите удалить этот подбор запчастей?',
            routerLink: router.selectionLink,
            id: data._id,
            closeOnSubmit: false,
            onSubmit: (res) => {
                if (res.status === 200) {
                    router.setPrevState()
                }
                new ModalComponent({
                    template: 'default',
                    title: 'Удаление подбора запчастей',
                    text: res.data.message
                }).create()
            }
        })
    }
}


export default new SelectionController()