import { apiService, auth, router } from '../../common.modules.js'
import descriptionsModel from './descriptions.model.js'
import PaginationComponent from '../../../core/components/pagination.component.js'
import scrollToTop from '../../utils/utils.js'
import FilterProvide from '../../../core/providers/filter.provide.js'
import { Editor } from '@toast-ui/editor'
import { parseArrayToHTML } from '../../utils/utils.js'
import DescriptionsForm from './descriptions.form.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'

class DescriptionsController {
    async middleware() {
        try {
            let page = router.getParam('page')
            if (!page) {
                page = 1
                router.addParams('page', page)
                router.redirectUrlState()
            }
            const descriptions = await descriptionsModel.find()
            return {
                descriptions,
                page
            }
        } catch (e) {
            console.error(e)
        }
    }

    async middlewareEdit() {
        return await descriptionsModel.find()
    }

    functional(_, data, module) {
        const pagination = new PaginationComponent({
            query: '#pagination',
            onChange: async (pageNumber) => {
                router.addParams('page', pageNumber)
                router.redirectUrlState()
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        })
        pagination.render({
            currentPage: data.page,
            count: data.descriptions.count,
            limit: 40
        })
        new FilterProvide({
            root: '[data-filter-bar]',
            router,
            onChangeState: async () => {
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        }).init()
    }
    functionalEdit(_, data, module) {
        const editor = new Editor({
            el: document.querySelector('#editor'),
            previewStyle: 'vertical',
            height: '500px'
        })
        editor.setHTML(parseArrayToHTML(data.description))
        document.querySelector('.toastui-editor-contents').className = 'editor-content'
        new DescriptionsForm({
            method: 'PUT',
            title: 'Изменение описания товара',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            editor,
            onsuccess: () => {
                router.redirectUrlState('/admin/catalog/products_description')
                module.changeState()
            }
        }).init()
        DeleteHelper.delete({
            selector: '[data-description-delete]',
            title: 'Удаление описания товара',
            text: 'Вы действительно хотите удалить описание этого товара??',
            routerLink: router.productsDescriptionsLink,
            id: data._id,
            onsuccess: () => {
                router.redirectUrlState('/admin/catalog/products_description')
                module.changeState()
            }
        })
    }
    functionalAdd(_, data, module) {
        const editor = new Editor({
            el: document.querySelector('#editor'),
            previewStyle: 'vertical',
            height: '500px'
        })
        document.querySelector('.toastui-editor-contents').className = 'editor-content'
        new DescriptionsForm({
            method: 'POST',
            title: 'Добавления описания товара',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            editor,
            onsuccess: () => {
                router.redirectUrlState('/admin/catalog/products_description')
                module.changeState()
            }
        }).init()
    }
}


export default new DescriptionsController()