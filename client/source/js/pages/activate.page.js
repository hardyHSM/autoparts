import {
    preloader,
    router,
    apiService, sequentLoading
} from '../app/common.modules.js'
import ActivateController from '../app/controllers/activate.controller.js'



await sequentLoading()

new ActivateController({
    router,
    preloader,
    apiService
}).init()
