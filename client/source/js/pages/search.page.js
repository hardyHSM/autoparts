import {
    apiService,
    router,
    preloader,
    sequentLoading
} from '../app/common.modules.js'
import SearchModule from '../app/modules/search.module.js'

await sequentLoading()

await new SearchModule(
    {
        router,
        preloader,
        apiService
    }
).initPage()
preloader.hide()


