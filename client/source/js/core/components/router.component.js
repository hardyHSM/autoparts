class RouterComponent {
    constructor() {
        this.init()
    }

    init() {
        this.url = new URL(decodeURI(window.location.href))
    }

    addParams(key, value) {
        if (this.url.searchParams.has(key)) {
            this.url.searchParams.set(key, value)
        } else {
            this.url.searchParams.append(key, value)
        }
    }

    getUrlParams() {
        const path = this.url.pathname
        const [root, tab, menu, additionalAction] = path.split('/').filter(string => string.length)
        return {
            root, tab, menu, additionalAction
        }
    }

    removeParam(key) {
        this.url.searchParams.delete(key)
    }

    removeParams(keys) {
        keys.forEach(key => this.url.searchParams.delete(key))
    }

    removeAllParams() {
        this.url.search = ''
    }

    setPrevState() {
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

    get catalogFilter() {
        return `/api/catalog/filters/${this.url.pathname.replace('/catalog/', '')}`
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


    get orderLinkParams() {
        return `/api/order${this.url.search}`
    }

    get orderLink() {
        return `/api/order`
    }

    get ordersCountLink() {
        return `/api/order/count-orders`
    }

    get salesCountLink() {
        return `/api/order/count-sales`
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

    get productsLinkParams() {
        return `/api/products${this.url.search}`
    }

    get productsLink() {
        return `/api/products`
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
    get selectionLinkParams() {
        return `/api/selection${this.url.search}`
    }

    get feedBackLinkParams() {
        return `/api/feedback${this.url.search}`
    }

    get feedBackLink() {
        return `/api/feedback`
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

    get categoriesLinkParams() {
        return `/api/categories${this.url.search}`
    }

    get categoriesLink() {
        return `/api/categories`
    }

    get subcategoriesLinkParams() {
        return `/api/subcategories${this.url.search}`
    }

    get subcategoriesLink() {
        return `/api/subcategories`
    }

    productsDescriptionsSearch(value) {
        return `/api/products_descriptions?title=${value}`
    }

    get productsDescriptionsLink() {
        return `/api/products_descriptions`
    }

    get productsDescriptionsLinkParams() {
        return `/api/products_descriptions${this.url.search}`
    }

    get providerLink() {
        return '/api/products_providers'
    }

    get stocksLink() {
        return '/api/products_stocks'
    }

    get makersLink() {
        return '/api/products_makers'
    }

    get usersLinkParams() {
        return `/api/users${this.url.search}`
    }

    get usersLink() {
        return `/api/users`
    }
}


export default RouterComponent