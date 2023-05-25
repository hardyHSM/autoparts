import { html } from 'code-tag'
import { getTotalPrice, getTotalPriceWithPromo } from '../utils/utils.js'

export const renderProductsInOrder = (data) => {
    return `
        <div class="profile__order-products order-products order-products_theme-white">
            <div class="order-products__list">
                ${data.products.reduce((acc, { product, count }) => {
                    acc += `
                        <div class="order-products__item">
                            <div class="order-products__image">
                                <img src="/${product.image || 'img/assets/no_photo.jpg'}" alt="${product.title}">
                            </div>
                            <div class="order-products__info">
                                <strong class="order-products__maker">
                                    ${product.maker}
                                </strong>
                                <p class="order-products__title">${product.title}</p>
                            </div>
                            <div class="order-products__price">${product.price} ₽</div>
                            <div class="order-products__count">${count} шт.</div>
                            <div class="order-products__all">${product.price * count} ₽</div>
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
                <i class="order-products__value">${data.promo ? '-330 ₽ ' : 'Отсутствует'}</i>
            </div>
            <div class="order-products__detail">
                <strong class="order-products__title order-products__key">Итого</strong>
                <i class="order-products__value">${data.promo ? getTotalPriceWithPromo(data.products, 330) : getTotalPriceWithPromo(data.products, 0)}
                    ₽</i>
            </div>
            <div class="order-products__detail">
                <strong class="order-products__title order-products__key">Тип доставки</strong>
                <i class="order-products__value">${data.delivery ? 'Курьером' : 'Самовывоз'}</i>
            </div>
            <div class="order-products__detail">
                <strong class="order-products__title order-products__key">Способ оплаты</strong>
                <i class="order-products__value">${data.payment === 'call' ? 'Звонок оператору' : 'При получении'}</i>
            </div>
            <div class="order-products__detail">
                <strong class="order-products__title order-products__key">Локация</strong>
                <i class="order-products__value">${data.location}</i>
            </div>
        </div>
    `
}