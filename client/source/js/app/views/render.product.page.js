import { html } from 'code-tag'
import { parseArrayToHTML } from '../utils/utils.js'

export default function renderProductPage({ res, formattedAttributes, sizes }) {
    return `
        <div class="product-module__header">
            <div class="product-module__pic">
                <img src="/${res.image || 'img/assets/no_photo.jpg'}" alt="${res.title}">
            </div>
            <div class="product-module__info">
                <div class="product-module__row">
                    <strong class="product-module__price">Цена: <i>${res.price || 'Неизвестно'} ₽</i></strong>
                    ${res.count ? `<button class="button button_accent" data-add-product data-id="${res._id}">Добавить в корзину</button>` : `<button class="button button_accent button_disabled" data-id="${res._id}" disabled>Товара нет на складе</button>`}
                </div>
                <div class="properties">
                    <dl class="properties__list">
                        ${formattedAttributes.slice(0, 3).reduce((acc, item) => {
                            const key = item[0]
                            const value = item[1]
                            if (!Array.isArray(value)) {
                                acc += `
                                    <div class="properties__item">
                                        <dt class="properties__key"><span class="properties__text">${key}</span></dt>
                                        <dd class="properties__value">
                                            <a href="/search/attributes?key=${key}&value=${value}" class="properties__text">${value}</a>
                                        </dd>
                                    </div>`
                            } else {
                                acc += `
                                    <div class="properties__item">
                                        <dt class="properties__key"><span class="properties__text">${key}</span></dt>
                                        <dd class="properties__value">
                                            ${value.map(v => `<a href="/search/attributes?key=${key}&value=${v}" class="properties__text">${v}</a>`).join(', ')}
                                        </dd>
                                    </div>`
                            }
                            return acc
                        }, '')}
                    </dl>
                    <button class="properties__all" data-properties-all>
                        Все характеристики
                    </button>
                </div>
                ${sizes.length ? `
                    <div class="product-module__sizes sizes">
                        <strong class="sizes__title">Другие фасовки: </strong>
                        <ul class="sizes__list">
                            ${sizes.reduce((acc, item) => {
                                acc += `
                                        <li class="sizes__item">
                                            <a class="sizes__link button button_mini button_neutral" href="/products/${item._id}">${item.size}</a>
                                        </li>
                                    `
                                return acc
                            }, '')}
                        </ul>
                    </div>` : ''}
            </div>
        </div>
        <div class="product-module__body editor-content">
            ${parseArrayToHTML(res.info.description)}
        </div>
        <div class="product-module__footer properties properties_full" data-properties-all>
            <h3 class="properties__title">Характеристики</h3>
            <dl class="properties__list">
                ${formattedAttributes.reduce((acc, item) => {
                    const key = item[0]
                    const value = item[1]
                    if (!Array.isArray(value)) {
                        acc += `
                            <div class="properties__item">
                                <dt class="properties__key"><span class="properties__text">${key}</span></dt>
                                <dd class="properties__value">
                                    <a href="/search/attributes?key=${key}&value=${value}" class="properties__text">${value}</a>
                                </dd>
                            </div>`
                    } else {
                        acc += `
                            <div class="properties__item">
                                <dt class="properties__key"><span class="properties__text">${key}</span></dt>
                                <dd class="properties__value">
                                    ${value.map(v => {
                                        return `<a href="/search/attributes?key=${key}&value=${v}" class="properties__text">${v}</a>`
                                    }).join(', ')}
                                </dd>
                            </div>`
                    }
                    return acc
                }, '')}
            </dl>
        </div>
    `
}