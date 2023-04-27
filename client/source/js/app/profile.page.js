import { auth, locationModule, preloader, userNav, router, apiService} from '../core/common.modules.js'
import ProfileModule from '../core/modules/profile.module.js'


document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    preloader.hide()
    new ProfileModule({
        query: '.section-profile',
        auth,
        router,
        apiService
    }).init()
})



