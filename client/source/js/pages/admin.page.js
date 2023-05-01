import { auth, locationModule, preloader, router, userNav } from '../app/common.modules.js'
import AdminModule from '../app/modules/admin.module.js'

document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    preloader.hide()
    // new AdminModule({
    //     router,
    //     preloader,
    //     auth,
    //     root: '[data-tabs-root]',
    //     tabQuery: '[data-tab]',
    //     menuQuery: '[data-menu]'
    // }).init()
})



