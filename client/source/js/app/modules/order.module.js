import { renderOrderProducts } from '../views/render.order.js'
import OrderForm from '../forms/order.form.js'
import ModuleCore from '../../core/modules/module.core.js'

class OrderModule extends ModuleCore {
    constructor(config) {
        super(config)
        this.locationModule = config.locationModule
        this.$node = document.querySelector(config.selector)
    }
    async init() {
        await this.initStorageOrder()
    }
    async initStorageOrder() {
        this.orderData = JSON.parse(sessionStorage.getItem('order'))
        if(!this.orderData || !this.orderData.products.length) {
            this.router.redirectNotFound()
        } else {
            const data = await this.apiService.useRequest(this.router.cartProductsLink, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.orderData)
            })
            this.orderData.products = data.products.map(item => {
                item.price = item.product.price
                return item
            })
            this.renderPage(this.orderData)
            this.preloader.hide()
        }
    }
    renderPage(orderData) {
        document.querySelector('.order-products').innerHTML = renderOrderProducts(orderData)
        const orderForm = new OrderForm({
            form: '[data-order-form]',
            auth: this.auth,
            router: this.router,
            locationModule: this.locationModule,
            orderData: this.orderData,
            apiService: this.apiService,
            userNav: this.userNav
        })
        orderForm.renderFirstStage()
    }
}


export default OrderModule