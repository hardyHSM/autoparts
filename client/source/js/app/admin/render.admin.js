import { html } from 'code-tag'

export const renderCatalogAdmin = () => {
    return `
        <ul class="tabs-pages__menu tabs-menu">
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="categories" data-type="menu" href="/admin/catalog/categories">
                    Категории
                </a>
            </li>
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="subcategories" data-type="menu" href="/admin/catalog/subcategories">
                    Подкатегории
                </a>
            </li>
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="products" data-type="menu" href="/admin/catalog/products">
                    Продукты
                </a>
            </li>
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="products_description" data-type="menu" href="/admin/catalog/products_description">
                    Описание продуктов
                </a>
            </li>
        </ul>
        <div class="tabs-pages__data" data-menu></div>
    `
}

export const renderSalesAdmin = () => {
    return `
        <div class="tabs-pages__data" data-menu>
        </div>
    `
}

export const renderStateAdmin = () => {
    return `
        <div class="tabs-pages__data" data-menu>
        </div>
    `
}

export const renderUsersAdmin = () => {
    return `
        <ul class="tabs-pages__menu tabs-menu">
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="users" data-type="menu" href="/admin/users/users">
                    Пользователи
                </a>
            </li>
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="feedback" data-type="menu" href="/admin/users/feedback">
                    Обратная связь
                </a>
            </li>
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="selection" data-type="menu" href="/admin/users/selection">
                    Подбор запчастей
                </a>
            </li>
        </ul>
        <div class="tabs-pages__data" data-menu></div>
    `
}