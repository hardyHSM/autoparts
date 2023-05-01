import { auth, locationModule, userNav, preloader, router, apiService } from '../app/common.modules.js'
import ActivateController from '../core/controllers/activate.controller.js'

document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    new ActivateController({
        router,
        preloader,
        apiService
    }).init()
})

