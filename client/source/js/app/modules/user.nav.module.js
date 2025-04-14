import { getProductsCount } from '../utils/utils.js'
import ModuleCore from '../../core/modules/module.core.js'
import { html } from 'code-tag'

class UserNavModule extends ModuleCore {
    constructor(config) {
        super(config)
        this.$sign = document.querySelector('[data-user-sign]')
        this.$cart = document.querySelector('[data-user-cart]')
        this.modalLogin = config.modalLogin
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.render.bind(this));
        } else {
            this.render()
        }
    }

    async changeState() {
        if (this.auth.isAuth) {
            await this.auth.init()
            this.render()
        } else {
            this.render()
        }
    }

    render() {
        if (this.auth.isAuth) {
            this.$cart.dataset.cartCount = getProductsCount(this.auth.userData.cart.list) || ''
            this.$sign.innerHTML = !this.router.isProfilePage ? `
                <a href="/user/profile" class="user-nav__link user-nav__link_sign" data-user-count="${this.auth.userData.unreadMessagesCount || ''}">
                    <svg>
                        <use xlink:href="img/svg/sprite.svg#sign-in"></use>
                    </svg>
                    <span class="user-nav__span">${this.auth.userData.firstName}</span>
                </a>
            ` : `
                <div class="user-nav__link user-nav__link_sign" data-user-sign>
                    <svg>
                        <use xlink:href="img/svg/sprite.svg#sign-in"></use>
                    </svg>
                    <span class="user-nav__span">${this.auth.userData.firstName}</span>
                </div>
            `
            this.$sign.innerHTML += `
                <ul class="profile-list">
                    ${this.auth.userData.role.toLowerCase() === 'admin' ? `
                        <li class="profile-list__item">
                            <a href="/admin" class="profile-list__link">Управление сайтом</a>
                        </li>
                    ` : ''}
                    <li class="profile-list__item">
                        <a href="/user/profile/" class="profile-list__link">Профиль</a>
                    </li>
                    <li class="profile-list__item">
                        <a href="/user/purchases/" class="profile-list__link">Покупки</a>
                    </li>
                    <li class="profile-list__item">
                        <a href="/user/notifications" class="profile-list__link">Уведомления</a>
                    </li>
                    <li class="profile-list__item">
                        <button class="profile-list__link" data-logout>Выйти</button>
                    </li>
                </ul>
            `
            this.registerLogout()
        } else {
            const cart = JSON.parse(localStorage.getItem('cart'))?.products || []
            this.$cart.dataset.cartCount = getProductsCount(cart) || ''
            this.$sign.innerHTML = `
                <button class="user-nav__link user-nav__link_sign">
                    <svg>
                        <use xlink:href="img/svg/sprite.svg#sign-in"></use>
                    </svg>
                    <span class="user-nav__span">Войти</span>
                </button>
            `
            this.registerLoginModal()
        }
    }

    registerLoginModal() {
        const $sign_button = document.querySelector('[data-user-sign]')

        $sign_button.addEventListener('click', () => {
            this.modalLogin.create()
        })
    }


    registerLogout() {
        document.querySelector('[data-logout]').addEventListener('click', async () => {
            try {
                await this.apiService.useRequest(this.router.logoutLink, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json', 'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                })
                this.router.redirectMain()
            } catch (e) {
                console.log(e.message)
            }
        })
    }
}


export default UserNavModule