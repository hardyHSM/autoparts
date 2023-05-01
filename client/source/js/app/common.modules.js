import '../core/components/adaptive.component.js'
import './service/button.mobile.js'
import './service/page.overlay.js'
import './service/cookie.accept.js'

import PreloaderComponent from '../core/components/preloader.component.js'
import CatalogMenuModule from './modules/catalog.menu.module.js'
import RouterComponent from '../core/components/router.component.js'
import AuthController from '../core/controllers/auth.controller.js'
import LocationModule from './modules/location.module.js'
import UserNavModule from './modules/user.nav.module.js'
import ModalLogin from './modules/login.modal.js'
import SearchModule from './modules/search.module.js'
import config from './configs/adaptive.config.js'
import ElementTransporter from '../core/components/adaptive.component.js'
import ApiServiceComponent from '../core/components/api.service.component.js'

new ElementTransporter().appendElements(config)
export const preloader = new PreloaderComponent('.page__preloader')
export const router = new RouterComponent()

export const modalLogin = new ModalLogin({
    container: '.page-popup__container',
    router
})

export const auth = new AuthController({ router })
export const apiService = new ApiServiceComponent(auth)


new CatalogMenuModule({
    selector: '#catalog_list',
    router,
    apiService
}).init()


export const searchModule = new SearchModule({ router, preloader, apiService })
export const locationModule = new LocationModule({ auth, router, apiService })
export const userNav = new UserNavModule({ auth, router, modalLogin, apiService })
