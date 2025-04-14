import {
    auth,
    preloader,
    router,
    sequentLoading
} from '../app/common.modules.js'
import ProfileTabsModule from '../app/modules/profile.module.js'

await sequentLoading()
new ProfileTabsModule({
    router,
    preloader,
    auth,
    root: '[data-tabs-root]',
    tabQuery: '[data-tab]',
    menuQuery: '[data-menu]'
}).init()
preloader.hide()



