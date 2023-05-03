import { apiService, auth, router } from '../common.modules.js'
import ModuleTabs from '../../core/modules/module.tabs.js'
import {
    renderAddCategoryAdmin, renderAddProductsAdmin,
    renderAddSubcategoryAdmin,
    renderCatalogAdmin,
    renderCategoriesAdmin,
    renderEditCategoryAdmin,
    renderEditProductsAdmin,
    renderEditSubcategoryAdmin,
    renderProductsAdmin,
    renderSubcategoriesAdmin
} from './render.admin.js'
import categoriesController from './categories/categories.controller.js'
import subcategoriesController from './subcategories/subcategories.controller.js'
import ProductsController from './products/products.model.js'
import ProductsForm from './products/products.form.js'
import PaginationComponent from '../../core/components/pagination.component.js'
import productsController from './products/products.controller.js'


class AdminModule extends ModuleTabs {
    constructor(config) {
        super(config)
        this.config = {
            root: 'admin',
            tabsParams: {
                'catalog': {
                    render: renderCatalogAdmin,
                    default: 'categories'
                }
            },
            menuParams: {
                'categories': {
                    middleware: categoriesController.middleware,
                    render: renderCategoriesAdmin
                },
                'categories/add': {
                    render: renderAddCategoryAdmin,
                    functional: categoriesController.functionalAdd
                },
                'categories/edit': {
                    middleware: categoriesController.middlewareEdit,
                    render: renderEditCategoryAdmin,
                    functional: categoriesController.functionalEdit
                },
                'subcategories': {
                    middleware: subcategoriesController.middleware,
                    render: renderSubcategoriesAdmin
                },
                'subcategories/edit': {
                    middleware: subcategoriesController.middlewareEdit,
                    render: renderEditSubcategoryAdmin,
                    functional: subcategoriesController.functionalEdit
                },
                'subcategories/add': {
                    middleware: subcategoriesController.middlewareAdd,
                    render: renderAddSubcategoryAdmin,
                    functional: subcategoriesController.functionalAdd
                },
                'products': {
                    middleware: productsController.middleware,
                    render: renderProductsAdmin,
                    functional: productsController.functional
                },
                'products/edit': {
                    middleware: productsController.middlewareEdit,
                    render: renderEditProductsAdmin,
                    functional: productsController.functionalEdit
                },
                'products/add': {
                    middleware: productsController.middlewareAdd,
                    render: renderAddProductsAdmin,
                    functional: productsController.functionalAdd
                }
            }
        }
    }

}

export default AdminModule