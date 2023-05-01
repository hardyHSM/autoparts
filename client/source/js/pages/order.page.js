import { auth, locationModule, userNav, preloader, router, apiService } from '../app/common.modules.js'
import OrderModule from '../app/modules/order.module.js'


document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    new OrderModule({
        router,
        auth,
        preloader,
        apiService,
        locationModule,
        userNav,
        node: '.section-order'
    }).init()
})


