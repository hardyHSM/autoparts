import { apiService, auth, router } from '../../common.modules.js'
import descriptionsModel, { descriptionsConfig } from './descriptions.model.js'
import PaginationComponent from '../../../core/components/pagination.component.js'
import scrollToTop from '../../utils/utils.js'
import FilterProvide from '../../../core/providers/filter.provider.js'
import { parseArrayToHTML } from '../../utils/utils.js'
import DescriptionsForm from './descriptions.form.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'
import { productsConfig } from '../products/products.model.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'
import contentEditor from '../../../core/components/contentEditor.js'

class DescriptionsController {
    async middleware() {
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
    }

    async middlewareEdit() {
        const data = await descriptionsModel.find()
        if(data.message) throw new Error()
        return data
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
        contentEditor('#editor', parseArrayToHTML(data.description), 'editor-content')
        new DescriptionsForm({
            method: 'PUT',
            title: 'Изменение описания товара',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            editor,
            onSubmit: () => {

            }
        }).init()
        DeleteHelper.delete({
            selector: '[data-description-delete]',
            title: 'Удаление описания товара',
            text: 'Вы действительно хотите удалить описание этого товара??',
            routerLink: router.productsDescriptionsLink,
            closeOnSubmit: false,
            id: data._id,
            onSubmit: (res) => {
                if (res.status === 200) {
                    router.setPrevState()
                }
                new ModalComponent({
                    template: 'default',
                    title: 'Удаление описания продукта',
                    text: res.data.message
                }).create()
            }
        })
    }

    functionalAdd(_, data, module) {
        contentEditor('#editor', '', 'editor-content')
        new DescriptionsForm({
            method: 'POST',
            title: 'Добавления описания товара',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            editor,
            onSubmit: () => {
                router.redirectUrlState(descriptionsConfig.router.general)
                module.changeState()
            }
        }).init()
    }
}


export default new DescriptionsController()