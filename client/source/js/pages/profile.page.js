import { auth, locationModule, preloader, userNav, router, apiService} from '../app/common.modules.js'
import ProfileModule from '../app/modules/profile.module.js'
import ModuleTabs from '../core/modules/module.tabs.js'
import ProfileTabsModule from '../app/modules/profile.module.js'


document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    preloader.hide()
    new ProfileTabsModule({
        router,
        preloader,
        auth,
        root: '[data-tabs-root]',
        tabQuery: '[data-tab]',
        menuQuery: '[data-menu]'
    }).init()
})



