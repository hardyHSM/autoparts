import {
    auth,
    locationModule,
    preloader,
    router,
    userNav,
    apiService,
    catalogMenuModule, sequentLoading
} from '../app/common.modules.js'
import AdminModule from '../app/admin/admin.module.js'


await sequentLoading()
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


