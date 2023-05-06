import subcategoriesModel from './subcategories.model.js'
import categoriesModel from '../categories/categories.model.js'
import { apiService, auth, router } from '../../common.modules.js'
import SelectInputComponent from '../../../core/components/selects.inputs/select.input.component.js'
import SubcategoryForm from './subcategories.form.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'

class SubcategoriesController {
    async middleware() {
        const res = await subcategoriesModel.getAll()
        res.sort((prev, next) => prev.category?.name > next.category?.name ? 1 : -1)
        return res
    }

    async middlewareEdit() {
        const id = router.getParam('id')
        const [subcategory, allCategories] = await Promise.all([
            subcategoriesModel.getOne(id),
            categoriesModel.getAll()
        ])

        if (subcategory.message) {
            router.setPrevState()
        }
        return {
            subcategory,
            allCategories
        }
    }

    async middlewareAdd() {
        return categoriesModel.getAll()
    }

    async functionalEdit(_, data, module) {
        const selectData = data.allCategories.map(category => {
            return {
                value: category.name,
                dataset: category._id
            }
        })
        const select = new SelectInputComponent({
            query: '[data-category-select]',
            title: 'Выбор категории',
            key: 'categoryId',
            data: selectData
        })
        select.setTitle(data.subcategory.category?.name)
        select.render()
        new SubcategoryForm({
            method: 'PUT',
            title: 'Изменение подкатегории',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            select,
            router,
            auth,
            apiService
        }).init()
        DeleteHelper.delete({
            selector: '[data-subcategory-delete]',
            title: 'Удаление подкатегории',
            text: 'Вы действительно хотите удалить эту подкатегорию?',
            routerLink: router.subcategoriesLink,
            id: data.subcategory._id,
            onsuccess: () => {
                router.redirectUrlState('/admin/catalog/subcategories')
                module.changeState()
            }
        })
    }

    async functionalAdd(_, data, module) {
        const selectData = data.map(category => {
            return {
                value: category.name,
                dataset: category._id
            }
        })
        const select = new SelectInputComponent({
            query: '[data-category-select]',
            title: 'Выбор категории',
            key: 'categoryId',
            data: selectData
        })
        select.setTitle('')
        select.render()

        new SubcategoryForm({
            method: 'POST',
            title: 'Добавление подкатегории',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            select,
            router,
            auth,
            apiService,
            onsuccess: () => {
                router.redirectUrlState('/admin/catalog/subcategories')
                module.changeState()
            }
        }).init()
    }
}

export default new SubcategoriesController()