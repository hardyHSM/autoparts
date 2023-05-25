import { html } from 'code-tag'
import { parseDate } from '../../utils/utils.js'

export const renderStateContentAdmin = (data) => {
    return `
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">
                    Панель состояния
                </h2>
            </div>
            <div class="state">
                <div class="state__list">
                    <div class="state__item">
                        <h2 class="state__title">Всего заказов</h2>
                        <div class="state__body">
                            <div class="state__icon">
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#cart"></use>
                                </svg>
                            </div>
                            <strong class="state__count">${data.orders}</strong>
                        </div>
                        <div class="state__footer">
                            <a href="/admin/sales?sort_name=status&sort_type=1" class="state__link">Посмотреть</a>
                        </div>
                    </div>
                    <div class="state__item">
                        <h2 class="state__title">Всего продаж</h2>
                        <div class="state__body">
                            <div class="state__icon">
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#wallet"></use>
                                </svg>
                            </div>
                            <strong class="state__count">${data.sales}</strong>
                        </div>
                        <div class="state__footer">
                            <a href="/admin/sales?sort_name=status&sort_type=1&status=Сделка+завершена" class="state__link">Посмотреть</a>
                        </div>
                    </div>
                    <div class="state__item">
                        <h2 class="state__title">Всего пользователей</h2>
                        <div class="state__body">
                            <div class="state__icon">
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#sign-in"></use>
                                </svg>
                            </div>
                            <strong class="state__count">${data.users}</strong>
                        </div>
                        <div class="state__footer">
                            <a href="/admin/users" class="state__link">Посмотреть</a>
                        </div>
                    </div>
                    <div class="state__item">
                        <h2 class="state__title">Всего товаров</h2>
                        <div class="state__body">
                            <div class="state__icon">
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#product"></use>
                                </svg>
                            </div>
                            <strong class="state__count">${data.products}</strong>
                        </div>
                        <div class="state__footer">
                            <a href="/admin/catalog/products" class="state__link">Посмотреть</a>
                        </div>
                    </div>
                    <div class="state__item">
                        <h2 class="state__title">Всего категорий</h2>
                        <div class="state__body">
                            <div class="state__icon">
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#category"></use>
                                </svg>
                            </div>
                            <strong class="state__count">${data.categories}</strong>
                        </div>
                        <div class="state__footer">
                            <a href="/admin/catalog/categories" class="state__link">Посмотреть</a>
                        </div>
                    </div>
                    <div class="state__item">
                        <h2 class="state__title">Всего подкатегорий</h2>
                        <div class="state__body">
                            <div class="state__icon">
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#subcategory"></use>
                                </svg>
                            </div>
                            <strong class="state__count">${data.subcategories}</strong>
                        </div>
                        <div class="state__footer">
                            <a href="/admin/catalog/subcategories" class="state__link">Посмотреть</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
}