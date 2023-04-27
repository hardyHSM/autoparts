import renderCartTable from '../views/render.cart.js'
import renderCartNotification from '../views/render.notification.cart.js'
import NumberSelectComponent from '../components/number.select.component.js'
import { debounce, getTotalPrice, getTotalPriceWithPromo } from '../utils/utils.js'
import ModalComponent from '../components/modal.component.js'

const PROMO = 330

class CartModule {
    constructor(config) {
        this.preloader = config.preloader
        this.router = config.router
        this.apiService = config.apiService
        this.auth = config.auth
        this.userNav = config.userNav
        this.promoIsUsed = false
        this.header = document.querySelector('.page-header')
        this.cartNode = document.querySelector('[data-cart-output]')
        this.preloaderCart = document.querySelector('[data-cart-preloader]')
        this.totalPrice = document.querySelector('.section-cart__total-price')
        this.priceWithDiscount = document.querySelector('.arrange__price')
        this.handlerCloseNotification = this.handlerCloseNotification.bind(this)
        this.renderCartNotification = renderCartNotification.bind(this)
        this.selectedToOrder = []
    }

    async init() {
        if (!this.auth.isAuth) {
            await this.initStorageCart()
            this.registerHandlers()
            this.preloader.hide()
        } else {
            await this.initServerCart()
            this.registerHandlers()
            this.preloader.hide()
        }
    }

    registerHandlers() {
        const checkboxes = document.querySelectorAll('[data-cart-checkbox]')
        checkboxes.forEach(item => {
            item.addEventListener('change', (e) => {
                this.parseCheckbox(item)
            })
        })
        document.querySelector('[data-cart-submit]').addEventListener('click', (e) => {
            e.preventDefault()
            this.checkoutOrder()
        })
        document.querySelector('[data-cart-promo]').addEventListener('click', (e) => {
            this.renderDiscount()
        })
        document.querySelector('[data-cart-all]').addEventListener('click', (e) => {
            let toggleAll = e.target.dataset.enabled;
            e.target.dataset.enabled = toggleAll === 'false' ? 'true': 'false'
            checkboxes.forEach(item => {
                item.checked = toggleAll !== 'false' ? false : true
                this.parseCheckbox(item)
            })
        })
    }

    parseCheckbox(item) {
        const product = item.closest('[data-product]')
        if (item.checked) {
            this.selectedToOrder.push({
                id: product.dataset.productId,
                price: +(product.querySelector('[data-price]').textContent.match(/\d+/g).join('')),
                count: +product.querySelector('[data-numberselect] [data-value]').textContent
            })
        } else {
            this.selectedToOrder = this.selectedToOrder.filter(p => p.id !== product.dataset.productId)
        }
        this.renderTotalTitle()
        this.renderDiscount()
    }

    checkoutOrder() {
        if (!this.selectedToOrder.length) {
            new ModalComponent({
                template: 'default',
                title: 'Оформление заказа',
                text: 'Вы ничего не выбрали!'
            }).create()
            return
        }
        this.orderingCheckout()
    }

    orderingCheckout() {
        const order = {
            products: this.selectedToOrder,
            promo: this.promoIsUsed,

        }
        sessionStorage.setItem('order', JSON.stringify(order))
        this.router.redirectOrder()
    }


    renderDiscount() {
        if (this.isUsedPromo()) {
            document.querySelector('.promo__right').classList.add('promo__right_active')
            this.promoIsUsed = true
            this.renderTotalDiscountTitle()
        } else {
            document.querySelector('.promo__right').classList.remove('promo__right_active')
            this.promoIsUsed = false
            this.renderTotalDiscountTitle()
        }
    }


    productCountIsChanged({ id, value }) {
        const productIndex = this.selectedToOrder.findIndex(product => product.id === id)
        if (productIndex > -1) {
            this.selectedToOrder[productIndex].count = value
            this.renderTotalTitle()
            this.renderDiscount()
        }
    }

    isUsedPromo() {
        return document.querySelector('[data-promo-field]').value === 'test'
    }

    renderTotalTitle() {
        const summ = getTotalPrice(this.selectedToOrder)
        this.totalPrice.innerHTML = `${summ} ₽`
    }

    renderTotalDiscountTitle() {
        let promo = this.isUsedPromo() ? PROMO : 0
        let summ = getTotalPriceWithPromo(this.selectedToOrder, promo)
        this.priceWithDiscount.innerHTML = `${summ} ₽`
    }

    async initStorageCart() {
        let cart = JSON.parse(localStorage.getItem('cart'))
        if (cart?.products.length) {
            const res = await this.apiService.useRequest(this.router.cartProductsLink, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cart)
            })
            cart.products = cart.products.map(product => {
                product.price = res.products.find(item => item.product._id === product.id).price
                return product
            })
            localStorage.setItem('cart', JSON.stringify(cart))
            this.renderCart(res.products)
            this.cart = res
        } else {
            this.renderEmptyCart()
        }
    }

    async initServerCart() {
        const res = await this.apiService.useRequest(this.router.cartLink)
        if (!res.cart.list.length) {
            this.renderEmptyCart()
        }
        this.renderCart(res.cart.list)
        this.cart = {
            'products': res.cart.list
        }
    }

    renderCart(products) {
        renderCartTable(this.cartNode, products)
        document.querySelectorAll('[data-numberselect]').forEach(select => {
            const changeCountDebounce = debounce(this.changeProductCount.bind(this), 800)
            new NumberSelectComponent({
                node: select,
                onChange: (node, value) => {
                    const productNode = node.closest('[data-product]')
                    const productId = productNode.dataset.productId
                    const productPrice = this.cart.products.find(item => item.product._id === productId).product.price
                    productNode.querySelector('[data-summa]').innerHTML = `${+productPrice * value} ₽`
                    this.productCountIsChanged({
                        id: productId,
                        value
                    })
                    changeCountDebounce(productId, value)
                }
            }).init()
        })
        document.querySelectorAll('[data-delete]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.deleteProduct(button.closest('[data-product]').dataset.productId)
                button.closest('[data-product]').remove()
                if (this.cartNode.childElementCount < 2) {
                    this.renderEmptyCart()
                }
            })
        })
    }

    async deleteProduct(id) {
        const productIndex = this.selectedToOrder.findIndex(product => product.id === id)
        if (productIndex > -1) {
            this.selectedToOrder = this.selectedToOrder.filter(item => item.id != id)
            this.renderTotalTitle()
            this.renderDiscount()
        }
        if (!this.auth.isAuth) {
            const cart = JSON.parse(localStorage.getItem('cart'))
            cart.products = cart.products.filter(product => product.id !== id)
            cart.total = getTotalPrice(cart.products)
            localStorage.setItem('cart', JSON.stringify(cart))
        } else {
            this.showPreloader()
            await this.apiService.useRequest(this.router.cartLink, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id
                })
            })
            this.hidePreloader()
        }
        this.userNav.changeState()
    }

    async changeProductCount(id, value) {
        if (!this.auth.isAuth) {
            const cart = JSON.parse(localStorage.getItem('cart'))
            const changedProductIndex = cart.products.findIndex(product => product.id === id)
            cart.products[changedProductIndex].count = value
            cart.total = getTotalPrice(cart.products)
            localStorage.setItem('cart', JSON.stringify(cart))
        } else {
            this.showPreloader()
            await this.apiService.useRequest(this.router.cartLink, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id,
                        value
                    })
                })
            this.hidePreloader()
        }
        this.userNav.changeState()
    }


    renderEmptyCart() {
        const html = `
            <tr class="cart-table__row product-table">
                <td class="cart-table__col cart-table__col_big">Корзина пустая</td>
            </tr>`
        this.cartNode.insertAdjacentHTML('beforeend', html)
    }

    addProductStorage(id, product) {
        let cart = JSON.parse(localStorage.getItem('cart'))
        if (!cart) {
            cart = {
                products: [],
                total: 0
            }
        }
        const index = cart.products.findIndex(p => p.id === id)

        const plainProduct = {
            count: 1,
            id,
            price: product.price
        }

        if (index >= 0) {
            cart.products[index].count++
        } else {
            cart.products.push(plainProduct)
        }

        cart.total = cart.total + product.price
        localStorage.setItem('cart', JSON.stringify(cart))

        this.renderCartNotification({
            product: product,
            count: cart.products[index]?.count || plainProduct.count,
            totalCartPrice: cart.total
        })
        return cart
    }

    async addProduct(id, product = null) {
        if (this.auth.isAuth) {
            return await this.addProductServer(id)
        } else {
            return await this.addProductStorage(id, product)
        }
    }

    async addProductServer(id) {
        const data = await this.apiService.useRequest(this.router.cartLink, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id
            })
        })
        this.renderCartNotification({
            product: data.addedProduct.product,
            totalCartPrice: data.totalCartPrice,
            count: data.addedProduct.count
        })
        return data
    }

    handlerCloseNotification({ target }) {
        if (target.closest('[data-close]') || !target.closest('.cart-notification')) {
            document.querySelector('#notification').remove()
            document.body.removeEventListener('mousedown', this.handlerCloseNotification)
        }
    }

    showPreloader() {
        this.preloaderCart.classList.add('cart__preloader_active')
    }

    hidePreloader() {
        this.preloaderCart.classList.remove('cart__preloader_active')
    }
}


export default CartModule