import ModuleTabs from '../../core/modules/module.tabs.js'
import {
    renderAddCategoryAdmin,
    renderAddProductsAdmin,
    renderAddSubcategoryAdmin,
    renderCatalogAdmin,
    renderCategoriesAdmin,
    renderDescriptionsAdmin,
    renderEditCategoryAdmin,
    renderEditDescriptionsAdmin,
    renderEditProductsAdmin,
    renderEditSubcategoryAdmin,
    renderProductsAdmin,
    renderSubcategoriesAdmin,
    renderAddDescriptionsAdmin
} from './render.admin.js'
import categoriesController from './categories/categories.controller.js'
import subcategoriesController from './subcategories/subcategories.controller.js'
import productsController from './products/products.controller.js'
import descriptionsController from './descriptions/descriptions.controller.js'


class AdminModule extends ModuleTabs {
    constructor(config) {
        super(config)
        this.config = {
            root: 'admin',
            default: 'catalog',
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
                },
                'products_description': {
                    middleware: descriptionsController.middleware,
                    render: renderDescriptionsAdmin,
                    functional: descriptionsController.functional
                },
                'products_description/edit': {
                    middleware: descriptionsController.middlewareEdit,
                    render: renderEditDescriptionsAdmin,
                    functional: descriptionsController.functionalEdit
                },
                'products_description/add': {
                    render: renderAddDescriptionsAdmin,
                    functional: descriptionsController.functionalAdd
                }
            }
        }
    }

}

export default AdminModule