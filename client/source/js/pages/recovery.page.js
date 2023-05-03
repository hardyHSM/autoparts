import { auth, locationModule, userNav, preloader, router, apiService } from '../app/common.modules.js'
import RecoveryController from '../app/controllers/recovery.controller.js'


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

