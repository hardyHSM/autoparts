import { apiService, auth, router } from '../../common.modules.js'
import productsModel from './products.model.js'
import PaginationComponent from '../../../core/components/pagination.component.js'
import categoriesModel from '../categories/categories.model.js'
import subcategoriesModel from '../subcategories/subcategories.model.js'
import ProductsForm from './products.form.js'
import DeleteHelper from '../common/delete.provider.js'
import ScrollToTop from '../../utils/utils.js'
import SortProvider from '../common/sort.provider.js'

class ProductsController {
    async middleware() {
        const page = router.getParam('page')
        const products = await productsModel.get()
        return {
            products,
            page: page || 1
        }
    }

    async middlewareEdit() {
        const id = router.getParam('id')
        if (!id) {
            return
        }
        const [product, categories, subcategories, descriptions, providers, stocks] = await Promise.all([
            productsModel.get(),
            categoriesModel.getAll(),
            subcategoriesModel.getAll(),
            productsModel.getAllDescriptions(),
            productsModel.getAllProviders(),
            productsModel.getAllStocks()
        ])
        if (product.message) {
            router.setPrevState()
        }
        return {
            product,
            descriptions: descriptions.map(d => {
                return { value: d.title, dataset: d._id }
            }),
            categories: categories.map(c => {
                return { value: c.name, dataset: c._id }
            }),
            subcategories: subcategories.map(s => {
                return { value: s.name, dataset: s._id, category: s.category._id }
            }),
            providers,
            stocks
        }
    }

    async middlewareAdd() {
        const [categories, subcategories, descriptions, providers, stocks] = await Promise.all([
            categoriesModel.getAll(),
            subcategoriesModel.getAll(),
            productsModel.getAllDescriptions(),
            productsModel.getAllProviders(),
            productsModel.getAllStocks()
        ])
        return {
            descriptions: descriptions.map(d => {
                return { value: d.title, dataset: d._id }
            }),
            categories: categories.map(c => {
                return { value: c.name, dataset: c._id }
            }),
            subcategories: subcategories.map(s => {
                return { value: s.name, dataset: s._id, category: s.category._id }
            }),
            providers,
            stocks
        }
    }

    functional(_, data, module) {
        const pagination = new PaginationComponent({
            query: '#pagination',
            onChange: async (pageNumber) => {
                router.addParams('page', pageNumber)
                router.redirectUrlState()
                await module.renderMenuState()
                ScrollToTop('#top-element')
            }
        })
        pagination.render({
            currentPage: data.page,
            count: data.products.count,
            limit: 20
        })
        new SortProvider({
            root: '[data-sort-header]',
            router,
            changeStateHandler: async (key, type) => {
                router.addParams('sort_name', key)
                router.addParams('sort_type', type)
                router.redirectUrlState()
                await module.renderMenuState()
                ScrollToTop('#top-element')
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
            onsuccess: () => {
                router.redirectUrlState('/admin/catalog/products')
                module.changeState()
            },
            data
        }).init()
        DeleteHelper.delete({
            selector: '[data-product-delete]',
            title: 'Удаление продукта',
            text: 'Вы действительно хотите удалить этот товар?',
            routerLink: router.productsLink,
            id: data.product._id,
            onsuccess: () => {
                router.redirectUrlState('/admin/catalog/products')
                module.changeState()
            }
        })
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
            data,
            onsuccess: () => {
                router.redirectUrlState('/admin/catalog/products')
                module.changeState()
            }
        }).init()
    }
}


export default new ProductsController()