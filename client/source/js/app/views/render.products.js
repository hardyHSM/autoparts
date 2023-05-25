import { html } from 'code-tag'

export default function renderProducts(products, productClass = '') {
    let view = products.map(product => {
        const formattedAttributes = Object.entries(product.attributes).sort((prev, current) => {
            if (Array.isArray(prev[1])) {
                return 1
            } else {
                return -1
            }
        }).filter((_, index) => index <= 2)

        return `
            <article class="page-product ${productClass}">
                <div class="page-product__header">
                    <img class="page-product__img" data-src="/${product.image || 'img/assets/no_photo.jpg'}" alt="">
                </div>
                <div class="page-product__content">
                    <b class="page-product__title">${product.title}</b>
                    <ul class="page-product__spec spec-product">
                        ${formattedAttributes.map(item => {
                            const key = item[0]
                            let value = Array.isArray(item[1]) ? item[1].join(', ') : item[1]
                            return `
                                <li class="spec-product__item">
                                    <span class="spec-product__key">${key}: </span>
                                    <span class="spec-product__value">${value}</span>
                                </li>`
                        }).join('')}
                    </ul>
                    <a href="/products/${product._id}" class="page-product__button button button_backwards-accent">Узнать
                        цену</a>
                </div>
            </article>`
    }).join('')

    return view
}