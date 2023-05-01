import { auth, locationModule, userNav, preloader, router, apiService } from '../app/common.modules.js'
import CatalogModule from '../app/modules/catalog.module.js'

(async () => {
    new CatalogModule({
        preloader,
        router,
        apiService
    }).init()
    await auth.init()

    if(document.readyState === 'interactive' || document.readyState === 'complete') {
        renderModules()
    } else {
        document.addEventListener('DOMContentLoaded', renderModules)
    }
})()

const renderModules = async () => {
    userNav.render()
    locationModule.init()
}


// document.addEventListener('DOMContentLoaded', async () => {
    // new CatalogModule({
    //     preloader,
    //     router,
    //     apiService
    // }).init()
    // await auth.init()
    // userNav.render()
    // locationModule.init()
// })

