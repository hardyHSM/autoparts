import { sanitalize } from '../utils/utils.js'
// @formatter:off
export function renderSearchComplete(data, products = true) {
    let html = ''

    html += renderSearchBlock('Тип категории', 'category', data.categories, !products)
    html += renderSearchBlock('Тип подкатегории', 'subCategory', data.subCategories, !products)
    html += renderSearchBlock('Производитель', 'maker', data.makers, !products)
    html += renderSearchAttributes('Поиск по атрибуту', data.attributes, !products)
    if(products) {
        html += renderSearchProducts('Товары', data.products.list)
    }
    if(!html) {
        html += '<div class="search-list__notfound">Ничего не найдено</div>'
    }


    return html

}

const renderSearchBlock = (title, type, data = [], isFull) => {
    if(!data.length) {
        return ''
    }
    if(!isFull) {
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
                if(type === 'maker') {
                    link = `/search/maker?name=${item.name}`
                } else if(type === 'category') {
                    link = `/catalog/${item.link}`
                } else if(type === 'subCategory') {
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
    if(!data.length) {
        return ''
    }
    if(!isFull) {
        data.length = 2
    } else {
        data.length = 6
    }

    return data.reduce((acc, attr) => {
        if(!isFull) {
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
                    const key = encodeURIComponent(sanitalize(attr.key))
                    const val = encodeURIComponent(sanitalize(value.name))
                    const url = `/search/attributes?key=${key}&value=${val}`
                    a+= `
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
    if(!data.length) {
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
                    <a href="/product/${product._id}" class="search-list__body search-list__body_product">
                    <img src="/${product.image || 'img/assets/no_photo.jpg'}" alt="" title="${product.title}">
                       <span class="search-list__name">${product.title}</span>
                    </a>
                         `
                return acc
            }, '')}
        </div>
    `
}