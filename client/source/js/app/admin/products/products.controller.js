import { apiService, auth, router } from '../../common.modules.js'
import productsModel from './products.model.js'
import PaginationComponent from '../../../core/components/pagination.component.js'
import categoriesModel from '../categories/categories.model.js'
import subcategoriesModel from '../subcategories/subcategories.model.js'
import ProductsForm, { ProductFilterForm } from './products.form.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'
import scrollToTop from '../../utils/utils.js'
import SortProvider from '../../../core/providers/sort.provider.js'
import FilterProvider from '../../../core/providers/filter.provider.js'
import descriptionsModel from '../descriptions/descriptions.model.js'
import ModalCopyComponent from '../../../core/components/modals/modal.copy.component.js'
import { renderCopyProductsAdmin } from './products.views.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'
import DataEditorComponent from '../../../core/components/data.editor.component.js'

class ProductsController {
    constructor() {
        this.functionalAdd = this.functionalAdd.bind(this)
    }

    async middleware() {
        try {
            let page = router.getParam('page')
            if (!page) {
                page = 1
                router.addParams('page', page)
                router.redirectUrlState()
            }
            const [products, categories, subcategories] = await Promise.all([
                productsModel.find(),
                categoriesModel.findAll(),
                subcategoriesModel.findAll()
            ])
            return {
                products,
                categories: categories.map(c => {
                    return { value: c.name, dataset: c._id }
                }),
                subcategories: subcategories.map(s => {
                    return { value: s.name, dataset: s._id, category: s.category._id }
                }),
                page
            }
        } catch (e) {
            console.error(e)
        }
    }

    async middlewareEdit() {
        const id = router.getParam('id')
        if (!id) {
            return
        }
        const [product, categories, subcategories, providers, stocks, makers] = await Promise.all(
            [
                productsModel.find(),
                categoriesModel.findAll(),
                subcategoriesModel.findAll(),
                productsModel.getAllProviders(),
                productsModel.getAllStocks(),
                productsModel.getAllMakers()
            ])
        if (product.message) {
            router.setPrevState()
        }
        return {
            product,
            categories: categories.map(c => {
                return { value: c.name, dataset: c._id }
            }),
            subcategories: subcategories.map(s => {
                return { value: s.name, dataset: s._id, category: s.category._id }
            }),
            providers,
            stocks,
            makers
        }
    }

    async middlewareAdd() {
        const [categories, subcategories, providers, stocks, makers] = await Promise.all(
            [
                categoriesModel.findAll(),
                subcategoriesModel.findAll(),
                productsModel.getAllProviders(),
                productsModel.getAllStocks(),
                productsModel.getAllMakers()])
        return {
            categories: categories.map(c => {
                return { value: c.name, dataset: c._id }
            }),
            subcategories: subcategories.map(s => {
                return { value: s.name, dataset: s._id, category: s.category._id }
            }),
            providers,
            stocks,
            makers
        }
    }

    functional(_, data, module) {
        const pagination = new PaginationComponent({
            query: '#pagination', onChange: async (pageNumber) => {
                router.addParams('page', pageNumber)
                router.redirectUrlState()
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        })
        pagination.render({
            currentPage: data.page, count: data.products.count, limit: 20
        })
        new SortProvider({
            root: '[data-sort-header]',
            default: 'price',
            router, changeStateHandler: async (key, type) => {
                router.addParams('sort_name', key)
                router.addParams('sort_type', type)
                router.redirectUrlState()
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        }).init()
        new FilterProvider({
            root: '[data-filter-bar]',
            router,
            data,
            onChangeState: async () => {
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        }).init()

        new ProductFilterForm({
            method: 'GET',
            title: 'Получение фильтров в админке продуктов',
            form: '[data-filter-form]',
            router,
            auth,
            apiService,
            data,
            onSubmit: async () => {
                await module.renderMenuState()
            }
        }).init()
    }

    functionalEdit(_, data, module) {
        const attributesEditor = new DataEditorComponent({
            root: '[data-editor-attributes]',
            data: data.product.attributes
        })

        new ProductsForm({
            method: 'PUT',
            title: 'Изменение товара',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            data,
            attributesEditor
        }).init()

        DeleteHelper.delete({
            selector: '[data-product-delete]',
            title: 'Удаление продукта',
            text: 'Вы действительно хотите удалить это продукт?',
            routerLink: router.productsLink,
            id: data.product._id,
            closeOnSubmit: false,
            onSubmit: (res) => {
                if (res.status === 200) {
                    router.setPrevState()
                }
                new ModalComponent({
                    template: 'default',
                    title: 'Удаление продукта',
                    text: res.data.message
                }).create()
            }
        })
    }

    functionalAdd(_, data, module) {
        const attributesEditor = new DataEditorComponent({
            root: '[data-editor-attributes]',
            data: {}
        })
        new ProductsForm({
            method: 'POST',
            title: 'Добавление товара',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            data,
            attributesEditor
        }).init()
        this.functionalCopy(data)
    }

    functionalCopy(data) {
        document.querySelector('[data-copy-button]').addEventListener('click', () => {
            new ModalCopyComponent({
                onSelect: (product) => {
                    data.product = product
                    document.querySelector('.admin-panel__content').innerHTML = renderCopyProductsAdmin(data.product)
                    const attributesEditor = new DataEditorComponent({
                        root: '[data-editor-attributes]',
                        data: data.product.attributes
                    })
                    new ProductsForm({
                        method: 'POST',
                        title: 'Добавление товара',
                        submitSelector: '[data-submit]',
                        form: '[data-admin-form]',
                        hasImage: document.querySelector('.field-block__image').src,
                        router,
                        auth,
                        apiService,
                        data,
                        attributesEditor
                    }).init()
                    this.functionalCopy(data)
                }
            }).create()
        })
    }
}


export default new ProductsController()