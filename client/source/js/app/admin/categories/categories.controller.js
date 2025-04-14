import categoriesModel, { categoriesConfig } from './categories.model.js'
import { apiService, auth, router } from '../../common.modules.js'
import CategoryForm from './categories.form.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'
import SortProvider from '../../../core/providers/sort.provider.js'
import scrollToTop from '../../utils/utils.js'

class CategoriesController {
    async middleware() {
        return await categoriesModel.find()
    }

    async middlewareEdit() {
        const res = await categoriesModel.find()
        if (res.message) {
            router.setPrevState()
        }
        return res
    }

    functional(_, data, module) {
        new SortProvider({
            root: '[data-sort-header]',
            default: 'number',
            router,
            changeStateHandler: async (key, type) => {
                router.addParams('sort_name', key)
                router.addParams('sort_type', type)
                router.redirectUrlState()
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        }).init()
    }

    functionalAdd(_, data, module) {
        new CategoryForm({
            method: 'POST',
            title: 'Добавление категории',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            onSubmit: () => {
                router.redirectUrlState(categoriesConfig.router.general)
                module.changeState()
            }
        }).init()
    }

    functionalEdit(_, data, module) {
        new CategoryForm({
            method: 'PUT',
            title: 'Изменение категории',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            onSubmit: (res) => {
                router.redirectUrlState(categoriesConfig.router.general)
                module.changeState()
            }
        }).init()
        DeleteHelper.delete({
            selector: '[data-category-delete]',
            title: 'Удаление категории',
            text: 'Вы действительно хотите удалить эту категорию?',
            routerLink: router.categoriesLink,
            id: data._id,
            closeOnSubmit: false,
            onSubmit: (res) => {
                if (res.status === 200) {
                    router.setPrevState()
                }
                new ModalComponent({
                    template: 'default',
                    title: 'Удаление категории',
                    text: res.data.message
                }).create()
            }
        })
    }
}

const categoriesController = new CategoriesController()


export default categoriesController