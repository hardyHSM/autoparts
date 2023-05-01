import { html } from 'code-tag'

export default function renderCartNotification({ product, count, totalCartPrice }) {
    const view = html`
            <div class="cart-notification cart-notification_active" id="notification">
                <button class="cart-notification__close" data-close>
                    <svg>
                        <use xlink:href="img/svg/sprite.svg#close"></use>
                    </svg>
                </button>
                <div class="cart-notification__top">
                    <div class="cart-notification__left">
                        <img src="/${product.image || 'img/assets/no_photo.jpg'}" alt="${product.title}">
                    </div>
                    <div class="cart-notification__right">
                        <div class="cart-notification__info">Добавлено в корзину</div>
                        <b class="cart-notification__title">${product.title}</b>
    
                        <div class="cart-notification__summa">
                            <span class="cart-notification__product-price">${product.price} ₽</span>
                            <span class="cart-notification__add">x</span>
                            <span class="cart-notification__product-count">${count} ед.</span>
                            <span class="cart-notification__equal-sign">=</span>
                            <span class="cart-notification__equal">${product.price * count} ₽</span>
                        </div>
                        <div class="cart-notification__row">
                            <span>Всего в корзине:</span>
                            <div class="cart-notification__summa-all">${totalCartPrice} ₽</div>
                        </div>
                        <a href="/cart" class="cart-notification__button-cart button button_backwards-accent">Перейти в корзину</a>
                    </div>
                </div>
            </div>
        `
    document.querySelector('.page-header').insertAdjacentHTML('beforeend', view)

    document.body.addEventListener('mousedown', this.handlerCloseNotification)
}