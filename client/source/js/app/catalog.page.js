import { auth, locationModule, userNav, preloader, router, apiService } from '../core/common.modules.js'
import CatalogModule from '../core/modules/catalog.module.js'
import Filter from '../core/modules/filter.module.js'
import BreadcrumbsComponent from '../core/components/breadcrumbs.component.js'

document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    await new CatalogModule({
        preloader,
        router,
        apiService,
        filter: new Filter('#page-filter', '#filter-list', router),
        breadcrumbs: new BreadcrumbsComponent('#breadcrumbs'),
    }).init()
})

