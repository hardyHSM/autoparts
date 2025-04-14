import { auth, userNav, preloader, router, apiService, sequentLoading } from '../app/common.modules.js'
import ProductModule from '../app/modules/product.module.js'
import BreadcrumbsComponent from '../core/components/breadcrumbs.component.js'
import CartModule from '../app/modules/cart.module.js'


new ProductModule({
    preloader,
    router,
    cart: new CartModule({ router, auth, apiService }),
    breadcrumbs: new BreadcrumbsComponent('#breadcrumbs'),
    apiService,
    userNav,
    auth
}).init(sequentLoading)
