import ModuleTabs from '../../core/modules/module.tabs.js'
import categoriesController from './categories/categories.controller.js'
import subcategoriesController from './subcategories/subcategories.controller.js'
import productsController from './products/products.controller.js'
import descriptionsController from './descriptions/descriptions.controller.js'
import salesController from './orders/orders.controller.js'
import { renderContentAdmin, renderSalesAdmin, renderStateAdmin, renderUsersAdmin } from './render.admin.js'
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
import { renderEditOrdersAdmin, renderOrdersContentAdmin } from './orders/orders.views.js'
import usersController from './users/users.controller.js'
import { renderEditUsersAdmin, renderUsersContentAdmin } from './users/users.views.js'
import { renderEditFeedbackAdmin, renderFeedbackAdmin } from './feedback/feedback.views.js'
import feedbackController from './feedback/feedback.controller.js'
import selectionController from './selection/selection.controller.js'
import { renderEditSelectionAdmin, renderSelectionAdmin } from './selection/selection.views.js'
import { renderStateContentAdmin } from './state/state.views.js'
import stateController from './state/state.controller.js'
import {
    renderAddPagesAdmin,
    renderEditPagesAdmin,
    renderPagesAdmin,
    renderPagesMenu,
    renderPagesMenuContent
} from './pages/pages.views.js'
import pagesController from './pages/pages.controller.js'
import { categoriesConfig } from './categories/categories.model.js'
import { subcategoriesConfig } from './subcategories/subcategories.model.js'
import { productsConfig } from './products/products.model.js'
import { descriptionsConfig } from './descriptions/descriptions.model.js'
import { ordersConfig } from './orders/orders.model.js'
import { usersConfig } from './users/users.model.js'
import { feedbackConfig } from './feedback/feedback.model.js'
import { selectionConfig } from './selection/selection.model.js'
import { stateConfig } from './state/state.model.js'
import { pagesConfig } from './pages/pages.model.js'
import { analyticsConfig } from './analytics/analytics.model.js'
import { renderAnalyticsAdmin } from './analytics/analytics.view.js'
import analyticsController from './analytics/analytics.controller.js'

class AdminModule extends ModuleTabs {
    constructor(config) {
        super(config)
        this.config = {
            root: 'admin',
            default: 'state',
            tabsParams: {
                'content': {
                    render: renderContentAdmin,
                    default: 'categories'
                },
                'sales': {
                    render: renderSalesAdmin,
                    default: 'analytics'
                },
                'users': {
                    render: renderUsersAdmin,
                    default: 'users'
                },
                'state': {
                    render: renderStateAdmin,
                    default: 'state'
                },
                'pages': {
                    render: renderPagesAdmin,
                    default: 'pages'
                }
            },
            menuParams: {
                [categoriesConfig.states.general]: {
                    middleware: categoriesController.middleware,
                    functional: categoriesController.functional,
                    render: renderCategoriesAdmin
                },
                [categoriesConfig.states.add]: {
                    render: renderAddCategoryAdmin,
                    functional: categoriesController.functionalAdd
                },
                [categoriesConfig.states.edit]: {
                    middleware: categoriesController.middlewareEdit,
                    render: renderEditCategoryAdmin,
                    functional: categoriesController.functionalEdit
                },
                [subcategoriesConfig.states.general]: {
                    middleware: subcategoriesController.middleware,
                    functional: subcategoriesController.functional,
                    render: renderSubcategoriesAdmin
                },
                [subcategoriesConfig.states.edit]: {
                    middleware: subcategoriesController.middlewareEdit,
                    render: renderEditSubcategoryAdmin,
                    functional: subcategoriesController.functionalEdit
                },
                [subcategoriesConfig.states.add]: {
                    middleware: subcategoriesController.middlewareAdd,
                    render: renderAddSubcategoryAdmin,
                    functional: subcategoriesController.functionalAdd
                },
                [productsConfig.states.general]: {
                    middleware: productsController.middleware,
                    render: renderProductsAdmin,
                    functional: productsController.functional
                },
                [productsConfig.states.edit]: {
                    middleware: productsController.middlewareEdit,
                    render: renderEditProductsAdmin,
                    functional: productsController.functionalEdit
                },
                [productsConfig.states.add]: {
                    middleware: productsController.middlewareAdd,
                    render: renderAddProductsAdmin,
                    functional: productsController.functionalAdd
                },
                [descriptionsConfig.states.general]: {
                    middleware: descriptionsController.middleware,
                    render: renderDescriptionsAdmin,
                    functional: descriptionsController.functional
                },
                [descriptionsConfig.states.edit]: {
                    middleware: descriptionsController.middlewareEdit,
                    render: renderEditDescriptionsAdmin,
                    functional: descriptionsController.functionalEdit
                },
                [descriptionsConfig.states.add]: {
                    render: renderAddDescriptionsAdmin,
                    functional: descriptionsController.functionalAdd
                },
                [ordersConfig.states.general]: {
                    middleware: salesController.middleware,
                    render: renderOrdersContentAdmin,
                    functional: salesController.functional
                },
                [ordersConfig.states.edit]: {
                    middleware: salesController.middlewareEdit,
                    render: renderEditOrdersAdmin,
                    functional: salesController.functionalEdit
                },
                [usersConfig.states.general]: {
                    middleware: usersController.middleware,
                    render: renderUsersContentAdmin,
                    functional: usersController.functional
                },
                [usersConfig.states.edit]: {
                    middleware: usersController.middlewareEdit,
                    render: renderEditUsersAdmin,
                    functional: usersController.functionalEdit
                },
                [feedbackConfig.states.general]: {
                    middleware: feedbackController.middleware,
                    render: renderFeedbackAdmin,
                    functional: feedbackController.functional
                },
                [feedbackConfig.states.edit]: {
                    middleware: feedbackController.middlewareEdit,
                    render: renderEditFeedbackAdmin,
                    functional: feedbackController.functionalEdit
                },
                [selectionConfig.states.general]: {
                    middleware: selectionController.middleware,
                    render: renderSelectionAdmin,
                    functional: selectionController.functional
                },
                [selectionConfig.states.edit]: {
                    middleware: selectionController.middlewareEdit,
                    render: renderEditSelectionAdmin,
                    functional: selectionController.functionalEdit
                },
                [stateConfig.states.general]: {
                    middleware: stateController.middleware,
                    render: renderStateContentAdmin
                },
                [pagesConfig.states.general]: {
                    middleware: pagesController.middleware,
                    functional: pagesController.functional,
                    render: renderPagesMenuContent
                },
                [pagesConfig.states.add]: {
                    functional: pagesController.functionalAdd,
                    render: renderAddPagesAdmin
                },
                [pagesConfig.states.edit]: {
                    middleware: pagesController.middlewareEdit,
                    functional: pagesController.functionalEdit,
                    render: renderEditPagesAdmin
                },
                [analyticsConfig.states.general]: {
                    render: renderAnalyticsAdmin,
                    middleware: analyticsController.middleware,
                    functional: analyticsController.functional
                }
            }
        }
    }

}

export default AdminModule