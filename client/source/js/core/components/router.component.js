class RouterComponent {
    constructor() {
        this.init()
    }
    init() {
        // this.url = new URL(window.location.href)
        this.url = new URL(decodeURI(window.location.href))
        console.log(this.url)
    }
    addParams(key, value) {
        if (this.url.searchParams.has(key)) {
            this.url.searchParams.set(key, value)
        } else {
            this.url.searchParams.append(key, value)
        }
    }

    removeParam(key) {
        this.url = new URL(window.location.href)
        this.url.searchParams.delete(key)
    }
    removeParams(keys) {
        this.url = new URL(window.location.href)
        keys.forEach(key => this.url.searchParams.delete(key))
    }

    removeAllParams() {
        this.url.search = ''
    }

    prevState() {
        history.back()
    }

    getParam(key) {
        return this.url.searchParams.get(key)
    }

    redirectUrlState(url = this.url) {
        history.pushState(null, null, url)
    }
    reload() {
        window.location.reload()
    }

    get params() {
        return this.url.searchParams
    }

    get apiLink() {
        return `/api${this.url.pathname}${this.url.search}`
    }

    redirect(path) {
        window.location.href = path
    }

    redirectMain() {
        window.location.href = '/'
    }

    redirectOrder() {
        window.location.href = '/order'
    }

    redirectNotFound() {
        window.location.href = '/404'
    }

    get activateLink() {
        return `/api/auth${this.url.pathname}`
    }

    get recoveryLink() {
        return `/api/auth${this.url.pathname}`
    }

    get catalogLink() {
        return `/api/catalog/list`
    }

    get addOrderLink() {
        return `/api/order/add`
    }
    get passRecoveryLink() {
        return '/api/auth/pass-recovery'
    }

    get logoutLink() {
        return '/api/auth/logout'
    }

    get regLink() {
        return '/api/auth/registration'
    }

    get loginLink() {
        return '/api/auth/login'
    }

    get recoveryPasswordLink() {
        return `/api/auth/recovery-password`
    }

    get changePasswordLink() {
        return `/api/auth/change-password`
    }

    get changeProfileLink() {
        return `/api/auth/change`
    }

    get cartLink() {
        return `/api/cart/`
    }

    get cartProductsLink() {
        return `/api/cart/get-products`
    }

    get locationsLink() {
        return '/api/locations'
    }

    get authInfoLink() {
        return '/api/auth/info'
    }
    get selectionLink() {
        return '/api/selection'
    }
    get feedBackLink() {
        return '/api/feedback'
    }
    get userOrdersLink() {
        return '/api/auth/orders'
    }

    get searchLink() {
        return '/api/search'
    }

    get searchMakerLink() {
        return '/api/search/maker'
    }

    get searchAttributesLink() {
        return '/api/search/attributes'
    }

    get userNotificationsLink() {
        return '/api/auth/notifications'
    }

    get isProfilePage() {
        return this.url.pathname.startsWith('/user')
    }
}


export default RouterComponent