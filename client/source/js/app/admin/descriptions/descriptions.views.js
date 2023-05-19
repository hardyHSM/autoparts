import { html } from 'code-tag'

export const renderDescriptionsAdmin = ({ descriptions }) => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">
                    Описание продуктов
                    <strong class="admin-panel__count">(всего - ${descriptions.count})</strong>
                </h2>
                <div class="admin-panel__controls">
                    <a class="button button_backwards-accent button_icon"
                       data-type="menu"
                       data-state="products_description/add"
                       href="/admin/catalog/products_description/add">
                        Добавить
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#add"></use>
                        </svg>
                    </a>
                </div>
            </div>
            <div class="filter-bar" data-filter-bar>
                <div class="filter-bar__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Имя общего товара</b>
                    </div>
                    <div class="entry-input">
                        <input type="text" name="maker" class="entry-input__field" placeholder="Моторное масло SINTEC LUX SAE 10W-40" data-filter="title"/>
                    </div>
                </div>
            </div>
            <table class="admin-panel__table table table_classic">
                <tbody data-cart-output>
                <tr class="table__header table__row">
                    <th class="table__col">Имя общего товара</th>
                    <th class="table__col table__col_small" data-cart-all data-enabled="false">Изменить</th>
                </tr>
                ${descriptions.list.map(descr => {
                    return html`
                        <tr class="table__row">
                            <th class="table__col">${descr.title}</th>
                            <th class="table__col table__col_small table__col_right">
                                <a class="button button_mini button_accent button_icon-only"
                                   data-state="categories"
                                   data-type="menu"
                                   href="/admin/catalog/products_description/edit?id=${descr._id}">
                                    Изменить
                                    <svg>
                                        <use xlink:href="img/svg/sprite.svg#change"></use>
                                    </svg>
                                </a>
                            </th>
                        </tr>
                    `
                }).join('')}
                </tbody>
            </table>
            <div class="pagination" id="pagination">
                <ul class="pagination__list">
                </ul>
            </div>
        </div>`
}

export const renderEditDescriptionsAdmin = (description) => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Редактирование описания продукции</h2>
            </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                <input type="text" name="id" class="v-hidden" value="${description._id}">
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Имя продукции</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="title" class="entry-input__field" value="${description.title}" data-title/>
                        </div>
                    </div>
                </fieldset>
                <div id="editor" class="editor">

                </div>
                <div class="form__row form__bottom">
                    <button type="submit"
                            class="button button_success button_sq"
                            data-submit>
                        Изменить описание
                    </button>
                    <button type="button" class="button button_danger button_icon button_mini" data-description-delete>
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#trash"></use>
                        </svg>
                        Удалить описание
                    </button>
                    <a class="button button_neutral button_icon"
                       data-state="products"
                       data-type="menu"
                       href="/admin/catalog/products_description">
                        <span class="button__text">Назад</span>
                        <svg class="transform">
                            <use xlink:href="img/svg/sprite.svg#arrow"></use>
                        </svg>
                    </a>
                </div>
            </form>
        </div>
    `
}

export const renderAddDescriptionsAdmin = () => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Редактирование описания продукции</h2>
            </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                <input type="text" name="id" class="v-hidden" placeholder="Наименование товара">
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Имя продукции</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="title" class="entry-input__field" data-title/>
                        </div>
                    </div>
                </fieldset>
                <div id="editor" class="editor">

                </div>
                <div class="form__row form__bottom">
                    <button type="submit" class="button button_accent button_sq" data-submit>Добавить</button>
                    <a class="button button_neutral button_icon"
                       data-state="products_description"
                       data-type="menu"
                       href="/admin/catalog/products_description">
                        <span class="button__text">Назад</span>
                        <svg class="transform">
                            <use xlink:href="img/svg/sprite.svg#arrow"></use>
                        </svg>
                    </a>
                </div>
            </form>
        </div>
    `
}