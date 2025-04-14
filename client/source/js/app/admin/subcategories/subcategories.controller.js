import subcategoriesModel, { subcategoriesConfig } from './subcategories.model.js'
import categoriesModel from '../categories/categories.model.js'
import { apiService, auth, router } from '../../common.modules.js'
import SelectInputComponent from '../../../core/components/selectsinputs/select.input.component.js'
import SubcategoryForm from './subcategories.form.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'
import SortProvider from '../../../core/providers/sort.provider.js'
import scrollToTop from '../../utils/utils.js'

class SubcategoriesController {
    async middleware() {
        const res = await subcategoriesModel.find()
        return res
    }

    async middlewareEdit() {
        const [subcategory, allCategories] = await Promise.all([
            subcategoriesModel.find(),
            categoriesModel.findAll()
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
        return categoriesModel.findAll()
    }

    functional(_, data, module) {
        new SortProvider({
            root: '[data-sort-header]',
            default: 'category',
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
            apiService,
            onSubmit: (res) => {
                router.redirectUrlState(subcategoriesConfig.router.general)
                module.changeState()
            }
        }).init()
        DeleteHelper.delete({
            selector: '[data-subcategory-delete]',
            title: 'Удаление подкатегории',
            text: 'Вы действительно хотите удалить эту подкатегорию?',
            routerLink: router.subcategoriesLink,
            id: data.subcategory._id,
            closeOnSubmit: false,
            onSubmit: (res) => {
                if (res.status === 200) {
                    router.setPrevState()
                }
                new ModalComponent({
                    template: 'default',
                    title: 'Удаление подкатегории',
                    text: res.data.message
                }).create()
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
            onSubmit: () => {
                router.redirectUrlState(subcategoriesConfig.router.general)
                module.changeState()
            }
        }).init()
    }
}

export default new SubcategoriesController()