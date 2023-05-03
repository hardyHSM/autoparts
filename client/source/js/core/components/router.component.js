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

    get categoriesLink() {
        return '/api/categories'
    }

    get subcategoriesLink() {
        return '/api/subcategories'
    }

    getCategoryLink(id) {
        return `/api/categories?id=${id}`
    }

    getSubcategoryLink(id) {
        return `/api/subcategories?id=${id}`
    }

    get productsLinkWithParams() {
        return `/api/products${this.url.search}`
    }
    get productsDescriptionsLink() {
        return '/api/products_descriptions'
    }
    get providerLink() {
        return '/api/products_providers'
    }
    get stocksLink() {
        return '/api/products_stocks'
    }
}


export default RouterComponent