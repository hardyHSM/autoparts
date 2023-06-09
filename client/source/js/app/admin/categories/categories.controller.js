import categoriesModel from './categories.model.js'
import { apiService, auth, router } from '../../common.modules.js'
import CategoryForm from './categories.form.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'

class CategoriesController {
    middleware() {
        return categoriesModel.findAll()
    }

    async middlewareEdit() {
        const res = await categoriesModel.find()
        if (res.message) {
            router.setPrevState()
        }
        return res
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
            onsuccess: () => {
                router.redirectUrlState('/admin/catalog/categories')
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
            apiService
        }).init()
        DeleteHelper.delete({
            selector: '[data-category-delete]',
            title: 'Удаление категории',
            text: 'Вы действительно хотите удалить эту категорию?',
            routerLink: router.categoriesLink,
            id: data._id,
            onsuccess: () => {
                router.redirectUrlState('/admin/catalog/categories')
                module.changeState()
            }
        })
    }
}


export default new CategoriesController()