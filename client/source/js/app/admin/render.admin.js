import { html } from 'code-tag'

export const renderCatalogAdmin = () => {
    return html`
        <ul class="tabs-pages__menu tabs-menu">
            <li class="tabs-menu__item">
                <button class="tabs-menu__button" data-state="categories" data-type="menu" data-link="/admin/catalog/categories">
                    Категории
                </button>
            </li>
            <li class="tabs-menu__item">
                <button class="tabs-menu__button" data-state="subcategories" data-type="menu" data-link="/admin/catalog/subcategories">
                    Подкатегории
                </button>
            </li>
            <li class="tabs-menu__item">
                <button class="tabs-menu__button" data-state="products" data-type="menu" data-link="/admin/catalog/products">
                    Продукты
                </button>
            </li>
            <li class="tabs-menu__item">
                <button class="tabs-menu__button" data-state="products_description" data-type="menu" data-link="/admin/catalog/products_description">
                    Описание продуктов
                </button>
            </li>
        </ul>
        <div class="tabs-pages__data" data-menu></div>
    `
}

export const renderCategoriesAdmin = (categories) => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">
                    Категории
                    <strong class="admin-panel__count">(всего - ${categories.length})</strong>
                </h2>
                <div class="admin-panel__controls">
                    <button class="button button_backwards-accent button_icon"
                            data-type="menu"
                            data-state="categories/add"
                            data-link="/admin/catalog/categories/add">
                        Добавить
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#add"></use>
                        </svg>
                    </button>
                </div>
            </div>
            <table class="table table_classic">
                <tbody data-cart-output>
                <tr class="table__header table__row">
                    <th class="table__col">Имя категории</th>
                    <th class="table__col">Ссылка на категорию</th>
                    <th class="table__col">Приоритет категории</th>
                    <th class="table__col table__col_small" data-cart-all data-enabled="false">Изменить</th>
                </tr>
                ${categories.map(category => {
                    return html`
                        <tr class="table__row">
                            <th class="table__col">${category.name}</th>
                            <th class="table__col">${category.link}</th>
                            <th class="table__col">${category.number}</th>
                            <th class="table__col table__col_small table__col_right">
                                <button class="button button_mini button_accent button_icon-only"
                                        data-state="categories"
                                        data-type="menu"
                                        data-link="/admin/catalog/categories/edit?id=${category._id}">
                                    Изменить
                                    <svg>
                                        <use xlink:href="img/svg/sprite.svg#change"></use>
                                    </svg>
                                </button>
                            </th>
                        </tr>
                    `
                }).join('')}
                </tbody>
            </table>
        </div>`
}

export const renderAddCategoryAdmin = () => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Добавление категории</h2>
            </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                <fieldset class="form__row">
                    <legend class="v-hidden">Имя категории</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Имя категории</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="name" class="entry-input__field" placeholder="Жидкости" data-name/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <legend class="v-hidden">Ссылка категории</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Ссылка категории</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="link" class="entry-input__field" placeholder="liquids" data-link-field/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <legend class="v-hidden">Порядок в списке</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Порядок в списке</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="order" class="entry-input__field" placeholder="0" data-order/>
                        </div>
                    </div>
                </fieldset>
                <div class="form__row form__bottom">
                    <button type="submit" class="button button_accent button_sq" data-submit>Добавить</button>
                    <button type="button"
                            class="button button_neutral button_icon"
                            data-state="categories"
                            data-type="menu"
                            data-link="/admin/catalog/categories">
                        <span class="button__text">Назад</span>
                        <svg class="transform">
                            <use xlink:href="img/svg/sprite.svg#arrow"></use>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    `
}

export const renderEditCategoryAdmin = (category) => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Изменение категории</h2>
            </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                <input type="text" name="id" class="v-hidden" value="${category._id}">
                <fieldset class="form__row">
                    <legend class="v-hidden">Имя категории</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Имя категории</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="name" class="entry-input__field" value="${category.name}" placeholder="Жидкости" data-name/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <legend class="v-hidden">Ссылка категории</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Ссылка категории</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="link" class="entry-input__field" value="${category.link}" placeholder="liquids" data-link-field/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <legend class="v-hidden">Порядок в списке</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Порядок в списке</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="order" class="entry-input__field" value="${category.number}" placeholder="0" data-order/>
                        </div>
                    </div>
                </fieldset>
                <div class="form__row form__bottom">
                    <button type="submit"
                            class="button button_success button_sq"
                            data-submit>
                        Изменить категорию
                    </button>
                    <button type="button" class="button button_danger button_icon button_mini" data-category-delete>
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#trash"></use>
                        </svg>
                        Удалить категорию
                    </button>
                    <button type="button"
                            class="button button_neutral button_icon"
                            data-state="categories"
                            data-type="menu"
                            data-link="/admin/catalog/categories">
                        <span class="button__text">Назад</span>
                        <svg class="transform">
                            <use xlink:href="img/svg/sprite.svg#arrow"></use>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    `
}

export const renderSubcategoriesAdmin = (subcategories) => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">
                    Подкатегории
                    <strong class="admin-panel__count">(всего - ${subcategories.length})</strong>
                </h2>
                <div class="admin-panel__controls">
                    <button class="button button_backwards-accent button_icon"
                            data-type="menu"
                            data-state="subcategories/add"
                            data-link="/admin/catalog/subcategories/add">
                        Добавить
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#add"></use>
                        </svg>
                    </button>
                </div>
            </div>
            <table class="table table_classic">
                <tbody data-cart-output>
                <tr class="table__header table__row">
                    <th class="table__col">Имя подкатегории</th>
                    <th class="table__col">Ссылка на подкатегорию</th>
                    <th class="table__col">Категория</th>
                    <th class="table__col table__col_small" data-cart-all data-enabled="false">Изменить</th>
                </tr>
                ${subcategories.map(subcategory => {
                    return html`
                        <tr class="table__row">
                            <th class="table__col">${subcategory.name}</th>
                            <th class="table__col">${subcategory.link}</th>
                            <th class="table__col">${subcategory.category?.name || 'Категория отсутствует'}</th>
                            <th class="table__col table__col_small table__col_right">
                                <button class="button button_mini button_accent button_icon-only"
                                        data-state="subcategories"
                                        data-type="menu"
                                        data-link="/admin/catalog/subcategories/edit?id=${subcategory._id}">
                                    Изменить
                                    <svg>
                                        <use xlink:href="img/svg/sprite.svg#change"></use>
                                    </svg>
                                </button>
                            </th>
                        </tr>
                    `
                }).join('')}
                </tbody>
            </table>
        </div>`
}

export const renderEditSubcategoryAdmin = ({ subcategory }) => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Изменение подкатегории</h2>
            </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                <input type="text" name="id" class="v-hidden" value="${subcategory._id}">
                <fieldset class="form__row">
                    <legend class="v-hidden">Имя подкатегории</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Имя подкатегории</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="name" class="entry-input__field" value="${subcategory.name}" placeholder="Тормозные жидкости" data-name/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <legend class="v-hidden">Ссылка подкатегории</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Ссылка подкатегории</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="link" class="entry-input__field" value="${subcategory.link}" placeholder="brake_fluids" data-link-field/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <legend class="v-hidden">Категория</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Категория</b>
                        </div>
                        <div class="select select_input" data-category-select>
                            <div class="select__header">
                                <div class="entry-input">
                                    <input type="text" class="entry-input__field select__field select__title" placeholder="Выберите категорию">
                                </div>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                        <div class="field-block__undertext_error"></div>
                    </div>
                </fieldset>
                <div class="form__row form__bottom">
                    <button type="submit"
                            class="button button_success button_sq"
                            data-submit>
                        Изменить подкатегорию
                    </button>
                    <button type="button" class="button button_danger button_icon button_mini" data-subcategory-delete>
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#trash"></use>
                        </svg>
                        Удалить подкатегорию
                    </button>
                    <button type="button"
                            class="button button_neutral button_icon"
                            data-state="subcategories"
                            data-type="menu"
                            data-link="/admin/catalog/subcategories">
                        <span class="button__text">Назад</span>
                        <svg class="transform">
                            <use xlink:href="img/svg/sprite.svg#arrow"></use>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    `
}

export const renderAddSubcategoryAdmin = () => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Добавление подкатегории</h2>
            </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                <fieldset class="form__row">
                    <legend class="v-hidden">Имя подкатегории</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Имя подкатегории</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="name" class="entry-input__field" placeholder="Топливные" data-name/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <legend class="v-hidden">Ссылка подкатегории</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Ссылка подкатегории</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="link" class="entry-input__field" placeholder="fuel" data-link-field/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <legend class="v-hidden">Категория</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Категория</b>
                        </div>
                        <div class="select select_input" data-category-select>
                            <div class="select__header">
                                <div class="entry-input">
                                    <input type="text" class="entry-input__field select__field select__title" placeholder="Выберите категорию">
                                </div>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                        <div class="field-block__undertext_error"></div>
                    </div>
                </fieldset>
                <div class="form__row form__bottom">
                    <button type="submit" class="button button_accent button_sq" data-submit>Добавить</button>
                    <button type="button"
                            class="button button_neutral button_icon"
                            data-state="subcategories"
                            data-type="menu"
                            data-link="/admin/catalog/subcategories">
                        <span class="button__text">Назад</span>
                        <svg class="transform">
                            <use xlink:href="img/svg/sprite.svg#arrow"></use>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    `
}

export const renderProductsAdmin = (data) => {
    const products = data.products.list
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Товары
                    <strong class="admin-panel__count">(всего - ${data.products.count})</strong>
                </h2>
                <div class="admin-panel__controls">
                    <button class="button button_backwards-accent button_icon"
                            data-type="menu"
                            data-state="products/add"
                            data-link="/admin/catalog/products/add">
                        Добавить
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#add"></use>
                        </svg>
                    </button>
                </div>
            </div>
            <table class="table table_classic table_product">
                <tbody data-cart-output>
                <tr class="table__header table__row" data-sort-header>
                    <th class="table__col">Изображение</th>
                    <th class="table__col" data-sort="title">Название <svg class="table__sort-icon"></svg></th>
                    <th class="table__col table__col_small" data-sort="maker">Производитель <svg class="table__sort-icon"></svg></th>
                    <th class="table__col table__col_ultra-small" data-sort="price">Цена <svg class="table__sort-icon"></svg></th>
                    <th class="table__col table__col_small" data-sort="provider">Поставщик <svg class="table__sort-icon"></svg></th>
                    <th class="table__col table__col_small" data-sort="stock">Склад <svg class="table__sort-icon"></svg></th>
                    <th class="table__col table__col_small" data-sort="count">Количество <svg class="table__sort-icon"></svg></th>
                    <th class="table__col table__col_small" data-sort="popularity">Покупок <svg class="table__sort-icon"></svg></th>
                    <th class="table__col table__col_ultra-small" data-cart-all data-enabled="false">Изменить</th>
                </tr>
                ${products.map(product => {
                    return html`
                        <tr class="table__row">
                            <th class="table__col">
                                <img class="table_product-image" src="/${product.image || 'img/assets/no_photo.jpg'}" alt="${product.title}">
                            </th>
                            <th class="table__col">${product.title}</th>
                            <th class="table__col table__col_small">${product.maker}</th>
                            <th class="table__col table__col_ultra-small">${product.price} ₽</th>
                            <th class="table__col table__col_small">${product.provider}</th>
                            <th class="table__col table__col_small">${product.stock}</th>
                            <th class="table__col table__col_small">${product.count}</th>
                            <th class="table__col table__col_small">${product.popularity || 'Неизвестно'}</th>
                            <th class="table__col table__col_ultra-small table__col_right">
                                <button class="button button_mini button_accent button_icon-only"
                                        data-state="categories"
                                        data-type="menu"
                                        data-link="/admin/catalog/products/edit?id=${product._id}">
                                    Изменить
                                    <svg>
                                        <use xlink:href="img/svg/sprite.svg#change"></use>
                                    </svg>
                                </button>
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

export const renderEditProductsAdmin = ({ product }) => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Редактирование товара</h2>
            </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                <input type="text" name="id" class="v-hidden" value="${product._id}">
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Имя товара</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="title" class="entry-input__field" value="${product.title}" data-name/>
                        </div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Производитель</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="maker" class="entry-input__field" value="${product.maker}" data-maker/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Категория товара</b>
                        </div>
                        <div class="select select_input" data-category-select>
                            <div class="select__header">
                                <div class="entry-input">
                                    <input type="text" class="entry-input__field select__field select__title" placeholder="Выберите категорию">
                                </div>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                        <div class="field-block__undertext_error"></div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Подкатегория товара</b>
                        </div>
                        <div class="select select_input" data-subcategory-select>
                            <div class="select__header">
                                <div class="entry-input">
                                    <input type="text" class="entry-input__field select__field select__title" placeholder="Выберите подкатегорию">
                                </div>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                        <div class="field-block__undertext_error"></div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Выберите какое описание у продукта</b>
                        </div>
                        <div class="select select_input" data-description-select>
                            <div class="select__header">
                                <div class="entry-input">
                                    <input type="text" class="entry-input__field select__field select__title" placeholder="Выберите описание">
                                </div>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                        <div class="field-block__undertext_error"></div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <legend class="v-hidden">Количество</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Количество</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="count" class="entry-input__field" value="${product.count}" data-count/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Цена</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="price" class="entry-input__field" value="${product.price}" data-price/>
                        </div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Количество приобретений</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="popularity" class="entry-input__field" value="${product.popularity}" data-popularity/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Поставщик</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req entry-input_complete">
                            <input type="text" name="provider" class="entry-input__field" autocomplete="off" value="${product.provider}" data-provider/>
                            <ul class="entry-input__complete">
                            </ul>
                        </div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Склад</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req entry-input_complete">
                            <input type="text" name="stock" class="entry-input__field" autocomplete="off" value="${product.stock}" data-stock/>
                            <ul class="entry-input__complete">
                            </ul>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Редактирование аттрибутов</b>
                        </div>
                        <div class="entry-input">
                            <textarea name="attributes" class="textarea entry-input__field" cols="50" data-attrbutes>${JSON.stringify(product.attributes, null, 4)}</textarea>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block field-block_load-image" data-image-input>
                        <div class="field-block__header">
                            <b class="field-block__title">Изображение продукта</b>
                        </div>
                        <img class="field-block__image" src="/${product.image || 'img/assets/no_photo.jpg'}" alt="${product.title}">
                        <div class="field-block__row">
                            <label class="button button_accent button_icon button_mini button_file">
                                <input type="file" accept=".jpg,.jpeg,.png" data-file-input>
                                <svg stroke="#fff" class="button__transparent">
                                    <use xlink:href="img/svg/sprite.svg#upload"></use>
                                </svg>
                                Изменить
                            </label>
                            <button type="button" class="button button_danger button_icon button_mini" data-file-delete>
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#trash"></use>
                                </svg>
                                Удалить
                            </button>
                        </div>
                    </div>
                </fieldset>
                <div class="form__row form__bottom">
                    <button type="submit"
                            class="button button_success button_sq"
                            data-submit>
                        Изменить товар
                    </button>
                    <button type="button" class="button button_danger button_icon button_mini" data-product-delete>
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#trash"></use>
                        </svg>
                        Удалить товар
                    </button>
                    <button type="button"
                            class="button button_neutral button_icon"
                            data-state="products"
                            data-type="menu"
                            data-link="/admin/catalog/products">
                        <span class="button__text">Назад</span>
                        <svg class="transform">
                            <use xlink:href="img/svg/sprite.svg#arrow"></use>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    `
}

export const renderAddProductsAdmin = () => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Добавление товара</h2>
            </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Имя товара</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="title" class="entry-input__field" data-name/>
                        </div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Производитель</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="maker" class="entry-input__field" data-maker/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Категория товара</b>
                        </div>
                        <div class="select select_input" data-category-select>
                            <div class="select__header">
                                <div class="entry-input">
                                    <input type="text" class="entry-input__field select__field select__title" placeholder="Выберите категорию">
                                </div>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                        <div class="field-block__undertext_error"></div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Подкатегория товара</b>
                        </div>
                        <div class="select select_input" data-subcategory-select>
                            <div class="select__header">
                                <div class="entry-input">
                                    <input type="text" class="entry-input__field select__field select__title" placeholder="Выберите подкатегорию">
                                </div>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                        <div class="field-block__undertext_error"></div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Выберите какое описание у продукта</b>
                        </div>
                        <div class="select select_input" data-description-select>
                            <div class="select__header">
                                <div class="entry-input">
                                    <input type="text" class="entry-input__field select__field select__title" placeholder="Выберите описание">
                                </div>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                        <div class="field-block__undertext_error"></div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <legend class="v-hidden">Количество</legend>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Количество</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="count" class="entry-input__field" value="0" data-count/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Цена</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="price" class="entry-input__field" data-price/>
                        </div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Количество приобретений</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="popularity" class="entry-input__field" value="0" data-popularity/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Поставщик</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req entry-input_complete">
                            <input type="text" name="provider" class="entry-input__field" autocomplete="off" data-provider/>
                            <ul class="entry-input__complete">
                            </ul>
                        </div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Склад</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req entry-input_complete">
                            <input type="text" name="stock" class="entry-input__field" autocomplete="off" data-stock/>
                            <ul class="entry-input__complete">
                            </ul>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Редактирование аттрибутов</b>
                        </div>
                        <div class="entry-input">
                            <textarea name="attributes" class="textarea entry-input__field" cols="50" data-attrbutes>{}</textarea>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block field-block_load-image" data-image-input>
                        <div class="field-block__header">
                            <b class="field-block__title">Изображение продукта</b>
                        </div>
                        <img class="field-block__image" src="img/assets/no_photo.jpg">
                        <div class="field-block__row">
                            <label class="button button_accent button_icon button_mini button_file">
                                <input type="file" accept=".jpg,.jpeg,.png" data-file-input>
                                <svg stroke="#fff" class="button__transparent">
                                    <use xlink:href="img/svg/sprite.svg#upload"></use>
                                </svg>
                                Изменить
                            </label>
                            <button type="button" class="button button_danger button_icon button_mini" data-file-delete>
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#trash"></use>
                                </svg>
                                Удалить
                            </button>
                        </div>
                    </div>
                </fieldset>
                <div class="form__row form__bottom">
                    <button type="submit"
                            class="button button_success button_sq"
                            data-submit>
                        Добавить
                    </button>
                    <button type="button"
                            class="button button_neutral button_icon"
                            data-state="products"
                            data-type="menu"
                            data-link="/admin/catalog/products">
                        <span class="button__text">Назад</span>
                        <svg class="transform">
                            <use xlink:href="img/svg/sprite.svg#arrow"></use>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    `
}