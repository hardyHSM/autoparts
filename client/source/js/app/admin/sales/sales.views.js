import { html } from 'code-tag'
import { parseDate } from '../../utils/utils.js'
import { renderAdminProductForm } from '../products/products.views.js'
import { renderProductsInOrder } from '../../views/render.products.order.js'

const statusConfig = {
    'Отменён': `
        <svg>
            <use xlink:href="img/svg/sprite.svg#no" fill="red"></use>
        </svg>
        Отменён
    `,
    'Сделка завершена': `
        <svg>
            <use xlink:href="img/svg/sprite.svg#yes" fill="transparent" stroke="green"></use>
        </svg>
        Сделка завершена
    `,
    'В процессе': `
        <svg>
            <use xlink:href="img/svg/sprite.svg#refresh" fill="#244993"></use>
        </svg>
        В процессе
    `,
    'В обработке': `
        <svg>
            <use xlink:href="img/svg/sprite.svg#question" fill="transparent" stroke="orange" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></use>
        </svg>
        В обработке
    `
}

export const renderSalesContentAdmin = ({ orders }) => {
    return `
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">
                    Заказы
                    <strong class="admin-panel__count">(всего - ${orders.count})</strong>
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
                            <th class="table__col">${order.total} ₽</th>
                            <th class="table__col table__col_icon">${statusConfig[order.status]}</th>
                            <th class="table__col table__col_ultra-small table__col_right">
                                <a class="button button_mini button_accent button_icon-only"
                                   data-state="sales"
                                   data-type="menu"
                                   href="/admin/sales/sales/edit?id=${order._id}">
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

export const renderEditSalesAdmin = (order) => {
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
                                <span class="select__title">Выбор</span>
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
                            class="button button_success button_sq"
                            data-submit>
                        Редактировать заказ
                    </button>
                    <button type="button" class="button button_danger button_icon button_mini" data-order-delete>
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#trash"></use>
                        </svg>
                        Удалить заказ
                    </button>
                    <a class="button button_neutral button_icon"
                       data-state="products"
                       data-type="menu"
                       href="/admin/sales">
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