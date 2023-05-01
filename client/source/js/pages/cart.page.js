import { auth, locationModule, userNav, preloader, router, apiService} from '../app/common.modules.js'
import CartModule from '../app/modules/cart.module.js'

document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    new CartModule({ router, auth, preloader, apiService, userNav }).init()
})


