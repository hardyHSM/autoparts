import { auth, locationModule, userNav, preloader, router, apiService } from '../core/common.modules.js'
import CatalogModule from '../core/modules/catalog.module.js'

document.addEventListener('DOMContentLoaded', async () => {
    new CatalogModule({
        preloader,
        router,
        apiService
    }).init()
    await auth.init()
    userNav.render()
    locationModule.init()
})

