

export default function renderCartTable(output, data) {
    data.forEach(item => {
        const { count, product } = item
        const view = `
            <tr class="table__row product-table" data-product data-product-id="${product._id}">
                <td class="table__col table__col_big">
                    <div class="product-table__header">
                        <a href="/products/${product._id}" class="product-table__title">${product.maker}</a>
                        <div class="product-table__tooltip tooltip-picture">
                            <svg class="tooltip-picture__icon">
                                <use xlink:href="img/svg/sprite.svg#photo"></use>
                            </svg>
                            <div class="tooltip-picture__body">
                                <img src="/${product.image || 'img/assets/no_photo.jpg'}" alt="${product.title}">
                            </div>
                        </div>
                    </div>
                    <p class="product-table__descr">${product.title}</p>
                </td>
                <td class="table__col product-table__supplier">
                    <span class="product-table__supplier-name">
                        ${product.provider}
                    </span>
                </td>
                <td class="table__col">
                    <span class="product-table__stock">
                        ${product.stock}
                    </span>
                </td>
                <td class="table__col">
                    <span class="product-table__price" data-price>
                       ${product.price} ₽
                    </span>
                </td>
                <td class="table__col">
                    <div class="number-select" data-numberselect>
                        <div class="number-select__body">
                            <div class="number-select__button number-select__left-button" data-decr>
                                -
                            </div>
                            <div class="number-select__value" data-value>${count}</div>
                            <div class="number-select__button number-select__right-button" data-incr>
                                +
                            </div>
                        </div>
                        <button class="number-select__delete" data-delete>
                            <svg>
                                <use xlink:href="img/svg/sprite.svg#trash"></use>
                            </svg>
                        </button>
                    </div>
                </td>
                <td class="table__col">
                    <div class="product-table__summa" data-summa>${product.price * count} ₽</div>
                </td>
                <td class="table__col">
                    ${getRelevanceClass(product.popularity)}
                </td>
                <td class="table__col table__col_small">
                    <label class="checkbox table__checkbox">
                        <input class="checkbox__input" type="checkbox" data-cart-checkbox>
                        <span class="checkbox__view">
                            <svg>
                                <use xlink:href="img/svg/sprite.svg#yes-fit"></use>
                            </svg>
                        </span>
                        <span class="checkbox__title">Отложить</span>
                    </label>
                </td>
            </tr>
        `
        output.insertAdjacentHTML('beforeend', view)
    })
}

function getRelevanceClass(rel) {
    if (rel > 250) {
        return `
         <div class="product-table__relevance product-table__relevance_high">
            <svg>
                <use xlink:href="img/svg/sprite.svg#yes"></use>
            </svg>
            <div class="product-table__relevance-text">Высокая</div>
        </div> `
    } else if (rel > 60) {
        return `
         <div class="product-table__relevance product-table__relevance_normal">
            <svg>
                <use xlink:href="img/svg/sprite.svg#yes"></use>
            </svg>
            <div class="product-table__relevance-text">Средняя</div>
        </div> `
    } else {
        return `
         <div class="product-table__relevance product-table__relevance_low">
            <svg>
                <use xlink:href="img/svg/sprite.svg#yes"></use>
            </svg>
            <div class="product-table__relevance-text">Низкая</div>
        </div> `
    }
}
