import profileConfig from '../configs/profile.config.js'
import ModuleCore from './module.core.js'

class ProfileModule extends ModuleCore{
    constructor(config) {
        super(config)
        this.$profileContentNode = document.querySelector('.profile')
        this.$node = document.querySelector(config.query)
        this.data = this.auth
        this.isLoading = false
    }
    init() {
        super.init()
        this.getInitialState()
        this.registerHandlers()
    }

    getInitialState() {
        const { tab, menu } = this.parseUrlPath()
        if(tab === '') {
            this.renderProfileState(profileConfig.defaultTab)
        } else {
            if(profileConfig.tabs[tab]) {
                this.renderProfileState(tab)
            } else {
                this.router.redirectNotFound()
            }
        }
        if(menu === '') {
            const firstMenuItemState = document.querySelector('.profile-menu__button')?.dataset?.state
            this.renderMenuState(firstMenuItemState)
        } else {
            const id = this.router.getParam('id')
            if(profileConfig.menu[menu]) {
                this.renderMenuState(menu, id && true)
            } else {
                this.router.redirectNotFound()
            }
        }
        if(!profileConfig.tabs[tab]) {
            this.router.redirectNotFound()
        }
    }

    registerHandlers() {
        this.$node.addEventListener('click', ({ target }) => {
            if(target.closest('[data-back]')) {
                this.router.init()
                this.router.removeParam('id')
                this.router.redirectUrlState()
                this.getInitialState()
                return
            }
            const $button = target.closest('[data-link]')
            if(this.isLoading || !$button) return

            const state = $button.dataset.state
            const link = $button.dataset.link
            if ($button.dataset.type === 'tab') {
                if($button.classList.contains('profile-tabs__button_active')) return
                this.renderProfileState(state)
                const firstMenuItemState = document.querySelector('.profile-menu__button')?.dataset?.state
                this.renderMenuState(firstMenuItemState)
            }
            if($button.dataset.type === 'menu') {
                if($button.classList.contains('profile-menu__button_active')) return
                this.renderMenuState(state)
            }
            this.router.redirectUrlState(link)
        })
    }

    parseUrlPath() {
        const path = this.router.url.pathname
        const data = path.match(/\/user(?:\/?)([a-zA-Z]*)?(?:\/?)(\D*)/)
        return {
            tab: data[1] || '',
            menu: data[2] || ''
        }
    }

    renderProfileState(state) {
        if (!profileConfig.tabs[state]) return
        this.registerActiveTab(state)
        this.$profileContentNode.innerHTML = profileConfig.tabs[state].render()
        this.profileDataNode = this.$node.querySelector('.profile__data')
    }
    async renderMenuState(state, isQuery = false) {
        if (!profileConfig.menu[state]) return
        this.registerActiveMenu(state)
        if(profileConfig.menu[state].preporator) {
            this.profileDataNode.innerHTML = '<div class="preloader"></div>'
            this.isLoading = true
            this.data = await profileConfig.menu[state].preporator() || this.auth
            this.isLoading = false
        } else {
            this.data = this.auth
        }
        if(isQuery && profileConfig.menu[state].queryLoad) {
            profileConfig.menu[state].queryLoad(this.profileDataNode, this.data)
        } else if(profileConfig.menu[state].render) {
            this.profileDataNode.innerHTML = profileConfig.menu[state].render(this.data)
        }
        profileConfig.menu[state].functional(this.profileDataNode, this.data)
    }

    registerActiveTab(state) {
        document.querySelectorAll('.profile-tabs__button').forEach(button => {
            button.classList.remove('profile-tabs__button_active')
        })
        document.querySelector(`[data-state='${state}']`).classList.add('profile-tabs__button_active')
    }

    registerActiveMenu(state) {
        document.querySelectorAll('.profile-menu__button').forEach(button => {
            button.classList.remove('profile-menu__button_active')
        })
        document.querySelector(`[data-state='${state}']`).classList.add('profile-menu__button_active')
    }
}


export default ProfileModule