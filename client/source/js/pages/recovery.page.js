import {
    preloader,
    router,
    apiService,
    sequentLoading
} from '../app/common.modules.js'
import RecoveryController from '../app/controllers/recovery.controller.js'

await sequentLoading()
new RecoveryController({
    preloader,
    router,
    apiService
}).init()