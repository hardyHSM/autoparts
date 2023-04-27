import { auth, locationModule, userNav, preloader, router, apiService } from '../core/common.modules.js'
import ProductModule from '../core/modules/product.module.js'
import BreadcrumbsComponent from '../core/components/breadcrumbs.component.js'
import CartModule from '../core/modules/cart.module.js'


document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    new ProductModule({
        preloader,
        router,
        cart: new CartModule({ router, auth, apiService }),
        breadcrumbs: new BreadcrumbsComponent('#breadcrumbs'),
        apiService,
        userNav
    }).init()
})
