import { preloader, router, apiService, sequentLoading } from '../app/common.modules.js'
import CatalogModule from '../app/modules/catalog.module.js'


new CatalogModule({
    preloader,
    router,
    apiService
}).init(sequentLoading)


