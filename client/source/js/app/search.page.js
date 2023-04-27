import '../core/service/slider.js'
import { auth, locationModule, preloader, userNav, searchModule} from '../core/common.modules.js'


document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    searchModule.initPage()
})



