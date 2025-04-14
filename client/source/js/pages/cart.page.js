import {
    auth,
    userNav,
    preloader,
    router,
    apiService,
    sequentLoading
} from '../app/common.modules.js'
import CartModule from '../app/modules/cart.module.js'


await sequentLoading()
new CartModule({ router, auth, preloader, apiService, userNav }).init()
