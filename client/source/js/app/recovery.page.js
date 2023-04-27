import { auth, locationModule, userNav, preloader, router, apiService } from '../core/common.modules.js'
import RecoveryController from '../core/controllers/recovery.controller.js'


document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    new RecoveryController({
        preloader,
        router,
        apiService
    }).init()
})

