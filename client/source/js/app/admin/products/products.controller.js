import { apiService, auth, router } from '../../common.modules.js'
import productsModel from './products.model.js'
import PaginationComponent from '../../../core/components/pagination.component.js'
import categoriesModel from '../categories/categories.model.js'
import subcategoriesModel from '../subcategories/subcategories.model.js'
import ProductsForm from './products.form.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'
import scrollToTop from '../../utils/utils.js'
import SortProvider from '../../../core/providers/sort.provider.js'
import FilterProvide from '../../../core/providers/filter.provide.js'
import descriptionsModel from '../descriptions/descriptions.model.js'
import ModalCopyComponent from '../../../core/components/modals/modal.copy.component.js'
import { renderCopyProductsAdmin } from './products.views.js'

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
            const products = await productsModel.find()
            return {
                products,
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
        new FilterProvide({
            root: '[data-filter-bar]', router, onChangeState: async () => {
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        }).init()
    }

    functionalEdit(_, data, module) {
        new ProductsForm({
            method: 'PUT',
            title: 'Изменение товара',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            data
        }).init()

    }

    functionalAdd(_, data, module) {
        new ProductsForm({
            method: 'POST',
            title: 'Добавление товара',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            data
        }).init()
        this.functionalCopy(data)
    }

    functionalCopy(data) {
        document.querySelector('[data-copy-button]').addEventListener('click', () => {
            new ModalCopyComponent({
                onSelect: (product) => {
                    data.product = product
                    document.querySelector('.admin-panel__content').innerHTML = renderCopyProductsAdmin(data.product)
                    new ProductsForm({
                        method: 'POST',
                        title: 'Добавление товара',
                        submitSelector: '[data-submit]',
                        form: '[data-admin-form]',
                        router,
                        auth,
                        apiService,
                        data
                    }).init()
                    this.functionalCopy(data)
                }
            }).create()
        })
    }
}


export default new ProductsController()