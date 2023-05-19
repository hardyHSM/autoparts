import { apiService, auth, router } from '../../common.modules.js'
import PaginationComponent from '../../../core/components/pagination.component.js'
import scrollToTop, { getTemplateMailSelection, parseArrayToHTML } from '../../utils/utils.js'
import SortProvider from '../../../core/providers/sort.provider.js'
import FilterProvider from '../../../core/providers/filter.provide.js'
import { Editor } from '@toast-ui/editor'
import SelectionForm from './selection.form.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'
import selectionModel from './selection.model.js'

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
        return await selectionModel.find()
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
            const editor = new Editor({
                el: document.querySelector('#editor'),
                previewStyle: 'vertical',
                height: '500px'
            })
            editor.setHTML(getTemplateMailSelection(data))
            document.querySelector('.toastui-editor-contents').className = 'editor-content'
            new SelectionForm({
                method: 'PUT',
                title: 'Ответ на подбор запчастей',
                submitSelector: '[data-submit]',
                form: '[data-admin-form]',
                router,
                auth,
                apiService,
                editor,
                onsuccess: () => {
                    router.redirectUrlState('/admin/users/selection')
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
            onsuccess: () => {
                router.redirectUrlState('/admin/users/selection')
                module.changeState()
            }
        })
    }
}


export default new SelectionController()