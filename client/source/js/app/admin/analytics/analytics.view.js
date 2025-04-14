import { html } from 'code-tag'
import { formatNumber } from '../../utils/utils.js'

export const renderAnalyticsAdmin = (data) => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header admin-panel__header_underlined">
                <h2 class="admin-panel__title">Аналитика продаж</h2>
            </div>
            <div class="analytics">
                <ul class="analytics__list analytics__header">
                    <li class="analytics__item state-item">
                        <span class="state-item__title">Заработано за всё время</span>
                        <div class="state-item__body">
                            <strong class="state-item__count">${formatNumber(data.revenue)}&nbsp;₽</strong>
                        </div>
                    </li>
                    <li class="analytics__item state-item">
                        <span class="state-item__title">Всего продаж</span>
                        <div class="state-item__body">
                            <strong class="state-item__count">${formatNumber(data.dealsCount)}&nbsp;</strong>
                            <small class="state-item__small">сделок</small>
                        </div>
                    </li>
                    <li class="analytics__item state-item">
                        <span class="state-item__title">Средний чек</span>
                        <div class="state-item__body">
                            <strong class="state-item__count">${formatNumber(data.averageTotal)}&nbsp;₽</strong>
                        </div>
                    </li>
                    <li class="analytics__item state-item">
                        <span class="state-item__title">Общее кол-во проданных товаров</span>
                        <div class="state-item__body">
                            <strong class="state-item__count">${formatNumber(data.productsCount)}&nbsp;</strong>
                            <small class="state-item__small">шт.</small>
                        </div>
                    </li>
                </ul>
                <div class="analytics__date entry-input entry-input_icon entry-input_date">
                    <input class="entry-input__field" type="text" placeholder="Выберите диапазон дат" readonly data-date-select>
                </div>
                <div class="analytics__dynamic-content" data-analytics-root></div>
            </div>
        </div>
    `
}