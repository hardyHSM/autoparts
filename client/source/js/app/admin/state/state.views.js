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
                    <div class="state__item state-item">
                        <h2 class="state-item__title">Всего заказов</h2>
                        <div class="state-item__body">
                            <div class="state-item__icon">
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#cart"></use>
                                </svg>
                            </div>
                            <strong class="state-item__count">${data.orders}</strong>
                        </div>
                        <div class="state-item__footer">
                            <a href="/admin/sales/orders?sort_name=status&sort_type=1" class="state-item__link">Посмотреть</a>
                        </div>
                    </div>
                    <div class="state__item state-item">
                        <h2 class="state-item__title">Всего продаж</h2>
                        <div class="state-item__body">
                            <div class="state-item__icon">
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#wallet"></use>
                                </svg>
                            </div>
                            <strong class="state-item__count">${data.sales}</strong>
                        </div>
                        <div class="state-item__footer">
                            <a href="/admin/sales/orders?sort_name=status&sort_type=1&status=Сделка+завершена" class="state-item__link">Посмотреть</a>
                        </div>
                    </div>
                    <div class="state__item state-item">
                        <h2 class="state-item__title">Всего пользователей</h2>
                        <div class="state-item__body">
                            <div class="state-item__icon">
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#sign-in"></use>
                                </svg>
                            </div>
                            <strong class="state-item__count">${data.users}</strong>
                        </div>
                        <div class="state-item__footer">
                            <a href="/admin/users" class="state-item__link">Посмотреть</a>
                        </div>
                    </div>
                    <div class="state__item state-item">
                        <h2 class="state-item__title">Всего товаров</h2>
                        <div class="state-item__body">
                            <div class="state-item__icon">
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#product"></use>
                                </svg>
                            </div>
                            <strong class="state-item__count">${data.products}</strong>
                        </div>
                        <div class="state-item__footer">
                            <a href="/admin/content/products" class="state-item__link">Посмотреть</a>
                        </div>
                    </div>
                    <div class="state__item state-item">
                        <h2 class="state-item__title">Всего категорий</h2>
                        <div class="state-item__body">
                            <div class="state-item__icon">
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#category"></use>
                                </svg>
                            </div>
                            <strong class="state-item__count">${data.categories}</strong>
                        </div>
                        <div class="state-item__footer">
                            <a href="/admin/content/categories" class="state-item__link">Посмотреть</a>
                        </div>
                    </div>
                    <div class="state__item state-item">
                        <h2 class="state-item__title">Всего подкатегорий</h2>
                        <div class="state-item__body">
                            <div class="state-item__icon">
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#subcategory"></use>
                                </svg>
                            </div>
                            <strong class="state-item__count">${data.subcategories}</strong>
                        </div>
                        <div class="state-item__footer">
                            <a href="/admin/content/subcategories" class="state-item__link">Посмотреть</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
}