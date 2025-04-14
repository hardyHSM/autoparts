import { html } from 'code-tag'

export const renderContentAdmin = () => {
    return `
        <ul class="tabs-pages__menu tabs-menu">
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="categories" data-type="menu" href="/admin/content/categories">
                    Категории
                </a>
            </li>
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="subcategories" data-type="menu" href="/admin/content/subcategories">
                    Подкатегории
                </a>
            </li>
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="products" data-type="menu" href="/admin/content/products">
                    Продукты
                </a>
            </li>
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="products_description" data-type="menu" href="/admin/content/products_description">
                    Описание продуктов
                </a>
            </li>
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="pages" data-type="menu" href="/admin/content/pages">
                    Управление страницами
                </a>
            </li>
        </ul>
        <div class="tabs-pages__data" data-menu></div>
    `
}

export const renderSalesAdmin = (root) => {
    return html`
        <ul class="tabs-pages__menu tabs-menu">
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="analytics" data-type="menu" href="/admin/sales/analytics">
                    Аналитика продаж
                </a>
            </li>
            <li class="tabs-menu__item">
                <a class="tabs-menu__button" data-state="orders" data-type="menu" href="/admin/sales/orders">
                    Список заказов
                </a>
            </li>
        </ul>
        <div class="tabs-pages__data" data-menu></div>
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