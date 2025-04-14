import '../app/service/slider.js'
import { preloader, sequentLoading } from '../app/common.modules.js'



await sequentLoading()

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        preloader.hide()
    })
} else {
    preloader.hide()
}


