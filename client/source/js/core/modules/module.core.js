class ModuleCore {
    constructor({ preloader, router, auth, apiService, selector, userNav }) {
        this.preloader = preloader
        this.router = router
        this.auth = auth
        this.apiService = apiService
        this.userNav = userNav
        this.$node = document.querySelector(selector)
    }
    init() {
        window.addEventListener('popstate', () => {
            this.router.reload()
        })
    }
    showPreloader() {
        this.$node.innerHTML = `<div class="preloader"></div>`
    }
    showEmpty() {
        this.$node.innerHTML = `<div class="not-found">Ничего не найдено</div>`
    }
    setTitle(text) {
        document.querySelector('[data-title]').innerHTML = text
    }
    addParamState(key, value, handler) {
        this.router.init()
        this.router.addParams(key, value)
        handler()
    }
    removeParamState(key, handler) {
        this.router.init()
        this.router.removeParam(key)
        handler()
    }
}

export default ModuleCore