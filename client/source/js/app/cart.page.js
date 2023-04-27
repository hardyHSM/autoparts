import { auth, locationModule, userNav, preloader, router, apiService} from '../core/common.modules.js'
import CartModule from '../core/modules/cart.module.js'

document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    new CartModule({ router, auth, preloader, apiService, userNav }).init()
})


