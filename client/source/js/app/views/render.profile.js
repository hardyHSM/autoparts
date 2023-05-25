import { getProductsCount, getTotalPrice, parseDate, getTotalPriceWithPromo } from '../utils/utils.js'
import { html } from 'code-tag'
import { renderProductsInOrder } from './render.products.order.js'

export function renderProfile(data) {
    return `
        <ul class="tabs-pages__menu tabs-menu">
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="personal" data-type="menu" href="/user/profile/personal">
                    Персональные данные
                </a>
            </li>
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="password" data-type="menu" href="/user/profile/password">
                    Смена пароля
                </a>
            </li>
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="logout" data-type="menu" href="/user/profile/logout">
                    Выйти
                </a>
            </li>
        </ul>
        <div class="tabs-pages__data profile" data-menu>
        </div>
    `
}

export function renderPurchases(data) {
    return `
        <ul class="tabs-pages__menu tabs-menu">
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-type="menu" data-state="cart" href="/user/purchases/cart">
                    Моя корзина
                </a>
            </li>
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="orders" data-type="menu" href="/user/purchases/orders">
                    Мои заказы
                </a>
            </li>
        </ul>
        <div class="tabs-pages__data profile" data-menu>
        </div>
    `
}

export function renderNotifications(data) {
    return `
        <ul class="tabs-pages__menu tabs-menu">
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-type="menu" data-state="messages" href="/user/notifications/messages">
                    Мои уведомления
                </a>
            </li>
        </ul>
        <div class="tabs-pages__data profile" data-menu></div>
    `
}

export function renderCart(data) {
    return `
        <h2 class="profile__title">Моя корзина</h2>
        <div class="profile-table">
            <div class="profile-table__header">
                <span class="profile-table__column-name">
                    Имя
                </span>
                <span class="profile-table__column-name">
                    Дата изменения
                </span>
                <span class="profile-table__column-name">
                    Кол-во товаров
                </span>
                <span class="profile-table__column-name">
                    Сумма
                </span>
            </div>
            <div class="profile-table__body">
                <span class="profile-table__column">
                    Корзина
                </span>
                <time class="profile-table__column">
                    ${parseDate(data.cart.updateTime)}
                </time>
                <span class="profile-table__column">
                    ${getProductsCount(data.cart.list)}
                </span>
                <span class="profile-table__column">
                    ${data.total} ₽
                </span>
                <a href="/cart" class="profile-table__link">
                    <svg>
                        <use xlink:href="img/svg/sprite.svg#search"></use>
                    </svg>
                </a>
            </div>
        </div>
    `
}


export function renderOrders(data) {
    return `
        <h2 class="profile__title">Мои заказы</h2>
        <div class="profile-table">
            <div class="profile-table__header">
                <span class="profile-table__column-name">
                    Номер заказа
                </span>
                <span class="profile-table__column-name">
                    Дата создания
                </span>
                <span class="profile-table__column-name">
                    Кол-во товаров
                </span>
                <span class="profile-table__column-name">
                    Сумма
                </span>
            </div>
            ${data.length ? data.reduce((acc, item, index) => {
                acc += `
                    <div class="profile-table__body">
                            <span class="profile-table__column">
                                ${index}
                            </span>
                        <span class="profile-table__column">
                                ${parseDate(item.createdAt)}
                            </span>
                        <span class="profile-table__column">
                                ${getProductsCount(item.products)}
                            </span>
                        <span class="profile-table__column">
                                ${item.total} ₽
                            </span>
                        <button data-param="/user/purchases/orders?id=${item._id}" data-id="${item._id}" class="profile-table__link">
                            <svg>
                                <use xlink:href="img/svg/sprite.svg#search"></use>
                            </svg>
                        </button>
                    </div>`
                return acc
            }, '') : `
                <div class="profile-table__body">
                    <div class="profile-table__empty">Нет заказов</div>
                </div>`}
        </div>
    `

}

export function renderOrderFull(data) {
    return `
        <h2 class="profile__title">Заказ от ${parseDate(data.createdAt)}</h2>
        ${renderProductsInOrder(data)}
        <a type="button" class="order-products__button button button_neutral button_icon" data-type="menu" data-state="orders"  href="/user/purchases/orders">
            <span class="button__text">Назад</span>
            <svg class="transform">
                <use xlink:href="img/svg/sprite.svg#arrow"></use>
            </svg>
        </a>
    `

}


export function renderPersonal({ info }) {
    return `
        <h2 class="profile__title">Персональные данные</h2>
        <form class="profile__form form" data-personal-form>
            <div class="form__row">
                <div class="form__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Имя</b>
                        <span class="field-block__req">(обязательное)</span>
                    </div>
                    <div class="entry-input entry-input_icon entry-input_req">
                        <input type="text" name="firstName" placeholder="Имя" class="entry-input__field" value="${info?.firstName || ''}" data-name/>
                    </div>
                    <div class="field-block__undertext_error"></div>
                </div>
                <div class="form__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Фамилия</b>
                        <span class="field-block__req"></span>
                    </div>
                    <div>
                        <div class="entry-input">
                            <input type="text" name="lastName" placeholder="Фамилия" class="entry-input__field" value="${info?.lastName || ''}" data-lastname/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form__row">
                <div class="form__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Телефон</b>
                        <span class="field-block__req">(обязательно)</span>
                    </div>
                    <div class="entry-input entry-input_icon entry-input_req">
                        <input type="tel" name="tel" class="entry-input__field" value="${info?.tel || ''}" data-tel/>
                    </div>
                    <div class="field-block__undertext_error"></div>
                </div>
                <div class="form__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Email</b>
                        <span class="field-block__req">(обязательное)</span>
                    </div>
                    <div class="entry-input entry-input_icon entry-input_req">
                        <input type="email" name="email" autocomplete="none" placeholder="Email" class="entry-input__field" value="${info?.email || ''}" data-email/>
                    </div>
                    <div class="field-block__undertext_error">
                        ${info?.isActivated ? '' : 'Ваша почта не подтверждена.'}
                    </div>
                </div>
            </div>
            <button class="order-form__submit button button_accent" data-submit>Изменить</button>
        </form>
    `
}

export function renderChangePassword() {
    return `
        <h2 class="profile__title">Смена пароля</h2>
        <form class="profile__form form" data-password-form>
            <div class="form__row">
                <div class="form__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Старый пароль</b>
                        <span class="field-block_req">(обязательное)</span>
                    </div>
                    <div class="entry-input entry-input_icon entry-input_pass entry-input_req">
                        <input type="password" name="password" placeholder="●●●●●●" class="entry-input__field" data-old-pass/>
                        <div class="entry-input__numbers">
                            <span class="entry-input__number-left">0</span>
                            <span class="entry-input__number-right">/6</span>
                        </div>
                    </div>
                    <div class="field-block__undertext">Введите старый пароль</div>
                    <div class="field-block__undertext_error"></div>
                </div>
                <div class="form__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Новый пароль</b>
                        <span class="field-block__req">(обязательное)</span>
                    </div>
                    <div class="entry-input entry-input_icon entry-input_pass entry-input_req">
                        <input type="password" name="repassword" placeholder="●●●●●●" class="entry-input__field" data-new-pass/>
                        <div class="entry-input__numbers">
                            <span class="entry-input__number-left">0</span>
                            <span class="entry-input__number-right">/6</span>
                        </div>
                    </div>
                    <div class="field-block__undertext">Не менее 6 символов. Можно использовать латинские буквы, цифры и
                        символы !@#$%^&*()_-+=?.,
                    </div>
                    <div class="field-block__undertext_error"></div>
                </div>
            </div>
            <button type="submit" class="form__submit button button_accent" data-submit>Сохранить пароль</button>
        </form>
    `
}

export function renderNotificationsList(data) {
    return `
        <h2 class="profile__title">Мои уведомления</h2>
        <div class="notifications">
            <div class="notifications__header ">
                <span class="notifications__column-name">
                   Время создания
                </span>
                <span class="notifications__column-name">
                    Сообщение
                </span>
            </div>
        </div>
        <ul class="notifications__list">
            ${data.reverse().reduce((acc, item) => {
                if (item.messageType === 'success') {
                    acc += `
                        <li class="notifications__item message message_sucess message_icon">
                            <div class="notifications__date">
                                ${parseDate(item.createdTime)}
                            </div>
                            <div class="notifications__info">
                                ${item.message}
                            </div>
                            <svg>
                                <use xlink:href="img/svg/sprite.svg#success"></use>
                            </svg>
                        </li>`
                } else {
                    acc += `
                        <li class="notifications__item message message_accent message_icon">
                            <div class="notifications__date">
                                ${parseDate(item.createdTime)}
                            </div>
                            <div class="notifications__info">
                                ${item.message}
                            </div>
                            <svg>
                                <use xlink:href="img/svg/sprite.svg#info"></use>
                            </svg>
                        </li>`
                }
                return acc
            }, '')}
        </ul>
        </div>`
}