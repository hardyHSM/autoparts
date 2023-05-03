import { getProductsCount } from '../utils/utils.js'
import ModuleCore from '../../core/modules/module.core.js'
import { html } from 'code-tag'

class UserNavModule extends ModuleCore {
    constructor(config) {
        super(config)
        this.$sign = document.querySelector('.user-nav__item_sign')
        this.$cart = document.querySelector('.user-nav__item_cart')
        this.modalLogin = config.modalLogin
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
            this.$sign.dataset.cartCount = this.auth.userData.unreadMessagesCount || ''
            this.$sign.innerHTML = !this.router.isProfilePage ? html`
                <a href="/user/profile" class="user-nav__link">
                    <svg>
                        <use xlink:href="img/svg/sprite.svg#sign-in"></use>
                    </svg>
                    <span>${this.auth.userData.firstName}</span>
                </a>
            ` : html`
                <span class="user-nav__span">
                    <svg>
                        <use xlink:href="img/svg/sprite.svg#sign-in"></use>
                    </svg>
                    <span>${this.auth.userData.firstName}</span>
                </span>
            `
            this.$sign.innerHTML += html`
                <ul class="profile-list">
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
            this.$sign.innerHTML = html`
                <button class="user-nav__link">
                    <svg>
                        <use xlink:href="img/svg/sprite.svg#sign-in"></use>
                    </svg>
                    <span>Войти</span>
                </button>
            `
            this.registerLoginModal()
        }
    }

    registerLoginModal() {
        const $sign_button = document.querySelector('.user-nav__item_sign')

        $sign_button.addEventListener('click', () => {
            this.modalLogin.create()
        })
    }


    registerLogout() {
        document.querySelector('[data-logout]').addEventListener('click', async () => {
            try {
                await this.apiService.useRequest(this.router.logoutLink, {
                    method: 'POST', headers: {
                        'Accept': 'application/json', 'Content-Type': 'application/json'
                    }, body: JSON.stringify({})
                })
                this.router.redirectMain()
            } catch (e) {
                console.log(e.message)
            }
        })
    }
}


export default UserNavModule