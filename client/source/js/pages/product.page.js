import { auth, locationModule, userNav, preloader, router, apiService } from '../app/common.modules.js'
import ProductModule from '../app/modules/product.module.js'
import BreadcrumbsComponent from '../core/components/breadcrumbs.component.js'
import CartModule from '../app/modules/cart.module.js'


(async () => {
    await auth.init()
    new ProductModule({
        preloader,
        router,
        cart: new CartModule({ router, auth, apiService }),
        breadcrumbs: new BreadcrumbsComponent('#breadcrumbs'),
        apiService,
        userNav,
        auth
    }).init()


    if(document.readyState === 'interactive' || document.readyState === 'complete') {
        await renderModules()
    } else {
        document.addEventListener('DOMContentLoaded', renderModules)
    }
})()

const renderModules = async () => {
    userNav.render()
    locationModule.init()
}

// document.addEventListener('DOMContentLoaded', async () => {