import ModuleTabs from '../../core/modules/module.tabs.js'
import categoriesController from './categories/categories.controller.js'
import subcategoriesController from './subcategories/subcategories.controller.js'
import productsController from './products/products.controller.js'
import descriptionsController from './descriptions/descriptions.controller.js'
import salesController from './sales/sales.controller.js'
import { renderCatalogAdmin, renderSalesAdmin, renderStateAdmin, renderUsersAdmin } from './render.admin.js'
import {
    renderAddCategoryAdmin,
    renderCategoriesAdmin,
    renderEditCategoryAdmin
} from './categories/categories.views.js'
import {
    renderAddSubcategoryAdmin,
    renderEditSubcategoryAdmin,
    renderSubcategoriesAdmin
} from './subcategories/subcategories.views.js'
import {
    renderAddProductsAdmin,
    renderEditProductsAdmin,
    renderProductsAdmin
} from './products/products.views.js'
import {
    renderAddDescriptionsAdmin,
    renderDescriptionsAdmin,
    renderEditDescriptionsAdmin
} from './descriptions/descriptions.views.js'
import { renderEditSalesAdmin, renderSalesContentAdmin } from './sales/sales.views.js'
import usersController from './users/users.controller.js'
import { renderEditUsersAdmin, renderUsersContentAdmin } from './users/users.views.js'
import { renderEditFeedbackAdmin, renderFeedbackAdmin } from './feedback/feedback.views.js'
import feedbackController from './feedback/feedback.controller.js'
import selectionController from './selection/selection.controller.js'
import { renderEditSelectionAdmin, renderSelectionAdmin } from './selection/selection.views.js'
import { renderStateContentAdmin } from './state/state.views.js'
import stateController from './state/state.controller.js'

class AdminModule extends ModuleTabs {
    constructor(config) {
        super(config)
        this.config = {
            root: 'admin',
            default: 'state',
            tabsParams: {
                'catalog': {
                    render: renderCatalogAdmin,
                    default: 'categories'
                },
                'sales': {
                    render: renderSalesAdmin,
                    default: 'sales'
                },
                'users': {
                    render: renderUsersAdmin,
                    default: 'users'
                },
                'state': {
                    render: renderStateAdmin,
                    default: 'state'
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
                },
                'sales': {
                    middleware: salesController.middleware,
                    render: renderSalesContentAdmin,
                    functional: salesController.functional
                },
                'sales/edit': {
                    middleware: salesController.middlewareEdit,
                    render: renderEditSalesAdmin,
                    functional: salesController.functionalEdit
                },
                'users': {
                    middleware: usersController.middleware,
                    render: renderUsersContentAdmin,
                    functional: usersController.functional
                },
                'users/edit': {
                    middleware: usersController.middlewareEdit,
                    render: renderEditUsersAdmin,
                    functional: usersController.functionalEdit
                },
                'feedback': {
                    middleware: feedbackController.middleware,
                    render: renderFeedbackAdmin,
                    functional: feedbackController.functional
                },
                'feedback/edit': {
                    middleware: feedbackController.middlewareEdit,
                    render: renderEditFeedbackAdmin,
                    functional: feedbackController.functionalEdit
                },
                'selection': {
                    middleware: selectionController.middleware,
                    render: renderSelectionAdmin,
                    functional: selectionController.functional
                },
                'selection/edit': {
                    middleware: selectionController.middlewareEdit,
                    render: renderEditSelectionAdmin,
                    functional: selectionController.functionalEdit
                },
                'state': {
                    middleware: stateController.middleware,
                    render: renderStateContentAdmin,
                }
            }
        }
    }

}

export default AdminModule