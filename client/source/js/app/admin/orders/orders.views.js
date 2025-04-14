import { html } from 'code-tag'
import { formatNumber, parseDate } from '../../utils/utils.js'
import { renderAdminProductForm } from '../products/products.views.js'
import { renderProductsInOrder } from '../../views/render.products.order.js'
import { ordersConfig } from './orders.model.js'

const statusConfig = {
    'Сделка завершена': `
        <svg>
            <use xlink:href="img/svg/sprite.svg#yes" fill="transparent" stroke="green"></use>
        </svg>
        Сделка завершена
    `,
    'Отменён': `
        <svg>
            <use xlink:href="img/svg/sprite.svg#no" fill="red"></use>
        </svg>
        Отменён
    `,
    'В процессе': `
        <svg>
            <use xlink:href="img/svg/sprite.svg#refresh" fill="#244993"></use>
        </svg>
        В процессе
    `,
    'Не обработан': `
        <svg>
            <use xlink:href="img/svg/sprite.svg#question" fill="transparent" stroke="orange" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></use>
        </svg>
        Не обработан
    `
}

export const renderOrdersContentAdmin = ({ orders }) => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">
                    Заказы
                    <strong class="admin-panel__count">(всего - ${orders.count} заказов, состоящих из ${orders.countProducts} шт. товаров, на сумму ${formatNumber(orders.total)}&nbsp;₽ )</strong>
                </h2>
            </div>
            <div class="filter-bar" data-filter-bar>
                <div class="filter-bar__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Статус заказа</b>
                    </div>
                    <div class="select select_icon-left" data-order-type>
                        <div class="select__header">
                            <span class="select__title">Выбор</span>
                            <svg>
                                <use xlink:href="img/svg/sprite.svg#options"></use>
                            </svg>
                        </div>
                        <ul class="select__body">
                        </ul>
                    </div>
                </div>
                <div class="filter-bar__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Диапазон времени</b>
                    </div>
                    <div class="entry-input entry-input_icon entry-input_date">
                        <input class="entry-input__field" type="text" placeholder="Выберите диапазон дат" readonly="true" data-date-select>
                    </div>
                </div>
            </div>
            <table class="admin-panel__table table table_classic">
                <tbody data-cart-output>
                <tr class="table__header table__row" data-sort-header>
                    <th class="table__col" data-sort="createdAt">Время создания
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col">Имя
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col">Телефон
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col" data-sort="total">Сумма
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col" data-sort="status">Статус
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col table__col_ultra-small">Изменить</th>
                </tr>
                ${orders.list.map(order => {
                    return `
                        <tr class="table__row">
                            <th class="table__col">${parseDate(order.createdAt)}</th>
                            <th class="table__col">${order.firstName}</th>
                            <th class="table__col">${order.tel}</th>
                            <th class="table__col">${order.total}&nbsp;₽</th>
                            <th class="table__col table__col_icon">${statusConfig[order.status]}</th>
                            <th class="table__col table__col_ultra-small table__col_right">
                                <a class="button button_mini button_accent button_icon-only"
                                   data-state="${ordersConfig.states.edit}"
                                   data-type="menu"
                                   href="${ordersConfig.router.edit}${order._id}">
                                    Изменить
                                    <svg>
                                        <use xlink:href="img/svg/sprite.svg#change"></use>
                                    </svg>
                                </a>
                            </th>
                        </tr>
                    `
                }).join('')}
                </tbody>
            </table>
            <div class="pagination" id="pagination">
                <ul class="pagination__list">
                </ul>
            </div>
        </div>`
}

export const renderEditOrdersAdmin = (order) => {
    if(order.status !== 'Сделка завершена') {
        return `
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Редактирование заказа от ${parseDate(order.createdAt)}</h2>
            </div>
            ${renderProductsInOrder(order)}
            <form method="post" class="form admin-panel__form" data-admin-form>
                <input type="text" name="id" class="v-hidden" value="${order._id}">
                <div class="form__row">
                    <div class="form__block field-block">   
                        <div class="field-block__header">
                            <b class="field-block__title">Имя</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="firstName" class="entry-input__field" autocomplete="off" value="${order.firstName}" data-name/>
                        </div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Фамилия</b>
                        </div>
                        <div class="entry-input entry-input_icon">
                            <input type="text" name="lastName" class="entry-input__field" autocomplete="off" value="${order.lastName}" />
                        </div>
                    </div>
                </div>
                <div class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Телефон</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="tel" class="entry-input__field" autocomplete="off" value="${order.tel}" data-tel/>
                        </div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Почта</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="email" class="entry-input__field" autocomplete="off" value="${order.email}" data-email/>
                        </div>
                    </div>
                </div>
                <div class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Оплата</b>
                        </div>
                        <div class="select" data-select-payment>
                            <div class="select__header">
                                <span class="select__title"></span>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Доставка</b>
                        </div>
                        <div class="select" data-select-delivery>
                            <div class="select__header">
                                <span class="select__title">Да</span>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Статус</b>
                        </div>
                        <div class="select" data-select-status>
                            <div class="select__header">
                                <span class="select__title">Да</span>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Промо</b>
                        </div>
                        <div class="select" data-select-promo>
                            <div class="select__header">
                                <span class="select__title">Да</span>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="form__row form__bottom">
                    <button type="submit"
                        class="button button_success button_icon"
                        data-submit>
                        Применить изменения
                        <svg stroke="#fff" class="button__transparent">
                            <use xlink:href="img/svg/sprite.svg#upload"></use>
                        </svg>
                    </button>
                    <button type="button" class="button button_danger button_icon button_mini" data-order-delete>
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#trash"></use>
                        </svg>
                        Удалить заказ
                    </button>
                    <a class="button button_neutral button_icon"
                       data-state="back"
                       data-type="menu"
                       href="${ordersConfig.router.general}">
                        <span class="button__text">Назад</span>
                        <svg class="transform">
                            <use xlink:href="img/svg/sprite.svg#arrow"></use>
                        </svg>
                    </a>
                </div>
            </form>
        </div>
    `
    } else {
        return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Просмотр заказа от ${parseDate(order.createdAt)}</h2>
            </div>
            <div class="admin-panel__message message message_accent message_icon">Данный заказ нельзя изменить, он был закрыт <strong>${parseDate(order.closeTime)}</strong><svg><use xlink:href="img/svg/sprite.svg#info"></use></svg></div>
            ${renderProductsInOrder(order, true)}
            <div class="profile__order-products order-products order-products_theme-white">
                <div class="order-products__detail">
                    <strong class="order-products__title order-products__key">Имя</strong>
                    <i class="order-products__value">${order.firstName}</i>
                </div>
                <div class="order-products__detail">
                    <strong class="order-products__title order-products__key">Фамилия</strong>
                    <i class="order-products__value">${order.lastName}</i>
                </div>
                <div class="order-products__detail">
                    <strong class="order-products__title order-products__key">Телефон</strong>
                    <i class="order-products__value">${order.tel}</i>
                </div>
                <div class="order-products__detail">
                    <strong class="order-products__title order-products__key">Почта</strong>
                    <i class="order-products__value">${order.email}</i>
                </div>
            </div>
            
            <form method="post" class="form admin-panel__form" data-admin-form>
                <div class="form__row form__bottom">
                    <button type="button" class="button button_danger button_icon button_mini" data-order-delete>
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#trash"></use>
                        </svg>
                        Удалить заказ
                    </button>
                    <a class="button button_neutral button_icon"
                       data-state="back"
                       data-type="menu"
                       href="${ordersConfig.router.general}">
                        <span class="button__text">Назад</span>
                        <svg class="transform">
                            <use xlink:href="img/svg/sprite.svg#arrow"></use>
                        </svg>
                    </a>
                </div>
            </form>
        </div>
    `
    }
}