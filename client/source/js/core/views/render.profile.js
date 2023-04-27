import { getProductsCount, getTotalPrice, parseDate, getTotalPriceWithPromo } from '../utils/utils.js'

export function renderProfile(data) {
    return `
        <div class="profile__content">
            <ul class="profile__menu profile-menu">
                <li class="profile-menu__item">
                    <button class="profile-menu__button profile-menu__button_active" data-state="personal" data-type="menu"  data-link="/user/profile/personal">Персональные данные</button>
                </li>
                <li class="profile-menu__item">
                    <button class="profile-menu__button" data-state="password" data-type="menu" data-link="/user/profile/password">Смена пароля</button>
                </li>
                <li class="profile-menu__item">
                    <button class="profile-menu__button" data-state="logout" data-type="menu" data-link="/user/profile/logout">Выйти</button>
                </li>
            </ul>
            <div class="profile__data">
            </div>
        </div>
    `
}

export function renderPurchases(data) {
    return `
        <div class="profile__content">
            <ul class="profile__menu profile-menu">
                <li class="profile-menu__item">
                    <button class="profile-menu__button profile-menu__button_active" data-type="menu" data-state="cart" data-link="/user/purchases/cart">Моя корзина</button>
                </li>
                <li class="profile-menu__item">
                    <button class="profile-menu__button" data-state="orders" data-type="menu" data-link="/user/purchases/orders">Мои заказы</button>
                </li>
            </ul>
            <div class="profile__data">
            </div>
        </div>
    `
}

export function renderNotifications(data) {
    return `
        <div class="profile__content">
            <ul class="profile__menu profile-menu">
                <li class="profile-menu__item">
                    <button class="profile-menu__button profile-menu__button_active" data-type="menu" data-state="messages" data-link="/user/notifications/messages">Мои уведомления</button>
                </li>
            </ul>
            <div class="profile__data"></div>
        </div>
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
                <span class="profile-table__column">
                    ${parseDate(data.cart.updateTime)}
                </span>
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
    // @formatter:off
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
                acc += `<div class="profile-table__body">
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
                }, '') : 
                `<div class="profile-table__body">
                    <div class="profile-table__empty">Нет заказов</div>
                 </div>`
        }
        </div>
    `
    // @formatter:on
}

export function renderOrderFull(data) {
    // @formatter:off
        return `
            <h2 class="profile__title">Заказ от ${parseDate(data.createdAt)}</h2>
            <div class="profile__order-products order-products order-products_theme-white">
                <div class="order-products__list">
                    ${data.products.reduce((acc, { product, count }) => {
                        acc += `
                                <div class="order-products__item">
                                    <div class="order-products__image">
                                        <img src="/${product.image || 'client/assets/no_photo.jpg'}" alt="${product.title}">
                                    </div>
                                    <div class="order-products__info">
                                        <strong class="order-products__maker">
                                            ${product.maker}
                                        </strong>
                                        <p class="order-products__title">${product.title}</p>
                                    </div>
                                    <div class="order-products__price">${product.price} ₽</div>
                                    <div class="order-products__count">${count} шт.</div>
                                    <div class="order-products__all">${product.price * count } ₽</div>
                                </div>
                            `
                        return acc
                    }, '')}
                </div>
                <div class="order-products__detail">
                    <strong class="order-products__title order-products__key">Сумма</strong>
                    <i class="order-products__value">${getTotalPrice(data.products)} ₽</i>
                </div>
                <div class="order-products__detail">
                    <strong class="order-products__title order-products__key">Промо-код</strong>
                    <i class="order-products__value">${data.promo ? '-330 ₽ ': 'Отсутствует' }</i>
                </div>
                <div class="order-products__detail">
                    <strong class="order-products__title order-products__key">Итого</strong>
                    <i class="order-products__value">${data.promo ? getTotalPriceWithPromo(data.products, 330): getTotalPriceWithPromo(data.products, 0)}  ₽</i>
                </div>
                <div class="order-products__detail">
                    <strong class="order-products__title order-products__key">Тип доставки</strong>
                    <i class="order-products__value">${ data.delivery ? 'Курьером': 'Самовывоз'}</i>
                </div>
                <div class="order-products__detail">
                    <strong class="order-products__title order-products__key">Способ оплаты</strong>
                    <i class="order-products__value">${ data.payment === 'call' ? 'Звонок оператору': 'При получении'}</i>
                </div>
                <div class="order-products__detail">
                    <strong class="order-products__title order-products__key">Локация</strong>
                    <i class="order-products__value">${data.location}</i>
                </div>
            </div>
            <button type="button" class="order-products__button button button_neutral button_icon" data-back>
                <span class="button__text">Назад</span>
                <svg class="transform"><use xlink:href="img/svg/sprite.svg#arrow"></use></svg>
            </button>
        `
        // @formatter:on
}


export function renderPersonal(auth) {
    return `
        <h2 class="profile__title">Персональные данные</h2>
        <form class="profile__form form" data-personal-form>
            <div class="form__row">
                <div class="form__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Имя</b>
                        <span class="field-block__req">(обязательное)</span>
                    </div>
                    <div class="page-input page-input_icon page-input_req">
                        <input type="text" name="firstName" placeholder="Имя" class="page-input__field" value="${auth?.userData?.firstName || ''}" data-name/>
                    </div>
                    <div class="field-block__undertext_error"></div>
                </div>
                <div class="form__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Фамилия</b>
                        <span class="field-block__req"></span>
                    </div>
                    <div>
                        <div class="page-input">
                            <input type="text" name="lastName" placeholder="Фамилия" class="page-input__field" value="${auth?.userData?.lastName || ''}" data-lastname/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form__row">
                <div class="form__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Телефон</b>
                        <span class="field-block__req">(Обязательно)</span>
                    </div>
                    <div class="page-input page-input_icon page-input_req">
                        <input type="tel" name="tel" class="page-input__field" value="${auth?.userData?.tel || ''}" data-tel/>
                    </div>
                    <div class="field-block__undertext_error"></div>
                </div>
                <div class="form__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Email</b>
                        <span class="field-block__req">(обязательное)</span>
                    </div>
                    <div class="page-input page-input_icon page-input_req">
                        <input type="email" name="email" autocomplete="none" placeholder="Email" class="page-input__field" value="${auth?.userData?.email || ''}" data-email/>
                    </div>
                    <div class="field-block__undertext_error">${auth.userData.isActivated ? '' : 'Ваша почта не подтверждена.'}</div>
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
                    <div class="page-input page-input_icon page-input_pass page-input_req">
                        <input type="password" name="password" placeholder="●●●●●●" class="page-input__field" data-old-pass/>
                        <div class="page-input__numbers">
                            <span class="page-input__number-left">0</span>
                            <span class="page-input__number-right">/6</span>
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
                    <div class="page-input page-input_icon page-input_pass page-input_req">
                        <input type="password" name="repassword" placeholder="●●●●●●" class="page-input__field" data-new-pass/>
                        <div class="page-input__numbers">
                            <span class="page-input__number-left">0</span>
                            <span class="page-input__number-right">/6</span>
                        </div>
                    </div>
                    <div class="field-block__undertext">Не менее 6 символов. Можно использовать латинские буквы, цифры и символы !@#$%^&*()_-+=?.,</div>
                    <div class="field-block__undertext_error"></div>
                </div>
            </div>
            <button type="submit" class="form__submit button button_accent" data-submit>Сохранить пароль</button>
        </form>
    `
}

export function renderNotificationsList(data) {
    // @formatter:off
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
                    if(item.messageType === 'success') {
                        acc += `
                        <li class="notifications__item message message_sucess message_icon">
                            <div class="notifications__date">
                                ${parseDate(item.createdTime)}
                            </div>
                            <div class="notifications__info">
                                ${item.message}
                            </div>
                            <svg><use xlink:href="img/svg/sprite.svg#success"></use></svg>
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
                                <svg><use xlink:href="img/svg/sprite.svg#info"></use></svg>
                            </li>`
                        }
                    return acc
                 }, '')}
            </ul>
        </div>
        
    `
    // @formatter:on
}