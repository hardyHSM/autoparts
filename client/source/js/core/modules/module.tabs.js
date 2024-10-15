import ModuleCore from './module.core.js'
import scrollToTop from '../../app/utils/utils.js'

class ModuleTabs extends ModuleCore {
    constructor(config) {
        super(config)
        this.$root = document.querySelector(config.root)
        this.$tab = document.querySelector(config.tabQuery)
        this.$menuQuery = config.menuQuery
        window.addEventListener('popstate', () => {
            this.router.init()
            this.changeState()
        })
    }

    init() {
        this.changeState()
        this.registerHandler()
    }

    changeState() {
        this.initRoutes()
        this.renderTabState()
        this.renderMenuState()
    }

    initRoutes() {
        this.router.init()
        try {
            const { root, tab, menu, additionalAction } = this.router.getUrlParams()
            if (root === this.config.root && !tab && !menu && !additionalAction) {
                this.tabState = this.config.default
                this.tabHandler = this.config.tabsParams[this.tabState]
            } else {
                this.tabState = tab
                this.tabHandler = this.config.tabsParams[this.tabState]
            }
            if (!menu) {
                this.menuState = this.tabHandler.default
                this.menuHandler = this.config.menuParams[this.menuState]
            } else {
                let menuData = menu
                if (additionalAction) {
                    menuData = [menu, additionalAction].join('/')
                }
                this.menuState = menu
                this.menuHandler = this.config.menuParams[menuData]
            }
        } catch (e) {
            this.router.redirectNotFound()
        }
    }

    renderTabState() {
        this.$tab.innerHTML = this.tabHandler?.render?.() || ''
        this.registerActiveButton('tab', this.tabState, 'tabs-pages__button_active')
    }

    async renderMenuState() {
        try {
            this.$menu = document.querySelector(this.$menuQuery)
            this.registerActiveButton('menu', this.menuState, 'tabs-menu__button_active')
            this.showPreloader()
            this.isLoading = true
            const data = await this.menuHandler?.middleware?.() || this.auth
            this.isLoading = false
            if(this.menuHandler?.render) {
                this.$menu.innerHTML = this.menuHandler?.render?.(data)
                scrollToTop('#top-element', 'auto')
                this.menuHandler?.functional?.(this.$menu, data, this)
            }
        } catch (err) {
            this.router.setPrevState()
        }
    }

    registerHandler() {
        this.$root.addEventListener('click', (e) => {
            const { target } = e
            const $button = target.closest('a[data-type]')
            if (!$button || $button.dataset.active === 'true' || this.isLoading) return
            e.preventDefault()
            const state = $button.dataset.state
            const link = $button.href
            const type = $button.dataset.type
            const activeClass = type === 'tab' ? 'tabs-pages__button_active' : 'tabs-menu__button_active'
            this.registerActiveButton(type, state, activeClass)
            this.router.redirectUrlState(link)
            this.changeState()
        })
    }

    registerActiveButton(type, state, activeClass) {
        document.querySelectorAll(`a[data-type="${type}"]`).forEach($item => {
            $item.dataset.active = 'false'
            $item.classList.remove(activeClass)
        })
        const $button = document.querySelector(`a[data-state='${state}'][data-type='${type}']`)
        if ($button) {
            $button.dataset.active = 'true'
            $button.classList.add(activeClass)
        }
    }

    showPreloader() {
        if(this.$menu) {
            this.$menu.innerHTML = '<div class="preloader"></div>'
        }
    }
}


export default ModuleTabs