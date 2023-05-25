import { sanitalize } from '../utils/utils.js'
import { html } from 'code-tag'

export function renderSearchComplete(data, products = true) {
    let view = ''

    view += renderSearchBlock('Тип категории', 'category', data.categories, !products)
    view += renderSearchBlock('Тип подкатегории', 'subCategory', data.subCategories, !products)
    view += renderSearchBlock('Производитель', 'maker', data.makers, !products)
    view += renderSearchAttributes('Поиск по атрибуту', data.attributes, !products)
    if (products) {
        view += renderSearchProducts('Товары', data.products.list)
    }
    if (!view) {
        view += '<div class="search-list__notfound">Ничего не найдено</div>'
    }


    return view

}

const renderSearchBlock = (title, type, data = [], isFull) => {
    if (!data.length) {
        return ''
    }
    if (!isFull) {
        data.length = 3
    } else {
        data.length = 6
    }

    let link = ''


    return `
        <div class="search-list__item">
            <div class="search-list__header">
                ${title}
            </div>
            ${data.reduce((acc, item) => {
                if (type === 'maker') {
                    link = `/search/maker?name=${item.name}`
                } else if (type === 'category') {
                    link = `/catalog/${item.link}`
                } else if (type === 'subCategory') {
                    link = `/catalog/${item.category.link}/${item.link}`
                }
                acc += `
                    <a href="${link}" class="search-list__body">
                        <span class="search-list__name">${item.name}</span>
                        <span class="search-list__count">(товаров - ${item.count})</span>
                    </a>
                `
                return acc
            }, '')}
        </div>
    `
}

const renderSearchAttributes = (title, data = [], isFull) => {
    if (!data.length) {
        return ''
    }
    if (!isFull) {
        data.length = 2
    } else {
        data.length = 6
    }

    return data.reduce((acc, attr) => {
        if (!isFull) {
            attr.values.length = 3
        } else {
            attr.values.length = 6
        }
        acc += `
            <div class="search-list__item">
                <div class="search-list__header">
                    ${attr.key}
                </div>
                ${attr.values.reduce((a, value) => {
                    const url = `/search/attributes?key=${attr.key}&value=${value.name}`
                    a += `
                        <a href="${url}" class="search-list__body">
                            <span class="search-list__name">${value.name}</span>
                            <span class="search-list__count">(товаров - ${value.count})</span>
                        </a>
                    `
                    return a
                }, '')}
            </div>`
        return acc
    }, '')
}

const renderSearchProducts = (title, data = []) => {
    if (!data.length) {
        return ''
    }
    data.length = 5
    return `
        <div class="search-list__item">
            <div class="search-list__header">
                ${title}
            </div>
            ${data.reduce((acc, product) => {
                acc += `
                    <a href="/products/${product._id}" class="search-list__body search-list__body_product">
                    <img src="/${product.image || 'img/assets/no_photo.jpg'}" alt="" title="${product.title}">
                       <span class="search-list__name">${product.title}</span>
                    </a>
                         `
                return acc
            }, '')}
        </div>
    `
}