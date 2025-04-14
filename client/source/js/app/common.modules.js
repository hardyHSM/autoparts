import '../core/components/adaptive.component.js'
import './service/button.mobile.js'
import './service/page.overlay.js'
import './service/cookie.accept.js'

import PreloaderComponent from '../core/components/preloader.component.js'
import CatalogMenuModule from './modules/catalog.menu.module.js'
import RouterComponent from '../core/components/router.component.js'
import AuthController from './controllers/auth.controller.js'
import LocationModule from './modules/location.module.js'
import UserNavModule from './modules/user.nav.module.js'
import ModalLogin from './modules/login.modal.js'
import config from './configs/adaptive.config.js'
import ElementTransporter from '../core/components/adaptive.component.js'
import ApiServiceComponent from '../core/components/api.service.component.js'
import NavigationModule from './modules/navigation.module.js'
import SearchComponent from '../core/components/search.component.js'


export const router = new RouterComponent()
export const auth = new AuthController({ router })
export const apiService = new ApiServiceComponent(auth)
export const preloader = new PreloaderComponent('.page__preloader')
export const modalLogin = new ModalLogin({ container: '.page-popup__container', router })
export const locationModule = new LocationModule({ root: '[data-location-header]', auth, router, apiService })
export const userNav = new UserNavModule({ auth, router, modalLogin, apiService })
export const searchComponent = new SearchComponent({ router, preloader, apiService })
export const navigationModule = new NavigationModule({ router, apiService, headerMenu: '.page-header__nav', footerMenu: '.page-footer__nav' })
searchComponent.init()



new CatalogMenuModule({ selector: '#catalog_list', router, apiService }).init()
new ElementTransporter().appendElements(config)


export const sequentLoading = async () => {
    await Promise.all([auth.init(), locationModule.loadData(), navigationModule.init()])
    locationModule.start()
    userNav.init()
}




