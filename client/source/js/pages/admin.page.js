import { auth, locationModule, preloader, router, userNav, apiService } from '../app/common.modules.js'
import AdminModule from '../app/admin/admin.module.js'

document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    preloader.hide()
    new AdminModule({
        router,
        preloader,
        auth,
        apiService,
        root: '[data-tabs-root]',
        tabQuery: '[data-tab]',
        menuQuery: '[data-menu]'
    }).init()
})



