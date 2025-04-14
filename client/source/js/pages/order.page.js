import {
    auth,
    locationModule,
    userNav,
    preloader,
    router,
    apiService,
} from '../app/common.modules.js'
import OrderModule from '../app/modules/order.module.js'
import { sequentLoading } from '../app/common.modules.js'


await sequentLoading()
new OrderModule({
    router,
    auth,
    preloader,
    apiService,
    locationModule,
    userNav,
    node: '.section-order'
}).init()

