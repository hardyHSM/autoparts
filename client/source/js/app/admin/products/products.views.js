import { html } from 'code-tag'

export const renderProductsAdmin = (data) => {
    const products = data.products.list
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Товары
                    <strong class="admin-panel__count">(найдено - ${data.products.count})</strong>
                </h2>
                <div class="admin-panel__controls">
                    <a class="button button_backwards-accent button_icon"
                       data-type="menu"
                       data-state="products/add"
                       href="/admin/catalog/products/add">
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
                        <b class="field-block__title">Название</b>
                    </div>
                    <div class="entry-input">
                        <input type="text" name="maker" class="entry-input__field" placeholder="Моторное масло SINTEC LUX SAE 10W-40" data-filter="title"/>
                    </div>
                </div>
                <div class="filter-bar__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Производитель</b>
                    </div>
                    <div class="entry-input">
                        <input type="text" name="maker" class="entry-input__field" placeholder="Addinol" data-filter="maker"/>
                    </div>
                </div>
                <div class="filter-bar__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Количество</b>
                    </div>
                    <div class="entry-input">
                        <input type="text" name="maker" class="entry-input__field" placeholder=">100" data-filter="count" data-filter-order="true"/>
                    </div>
                </div>
                <div class="filter-bar__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Покупок</b>
                    </div>
                    <div class="entry-input">
                        <input type="text" name="maker" class="entry-input__field" placeholder="<70" data-filter="popularity" data-filter-order="true"/>
                    </div>
                </div>
            </div>
            <table class="admin-panel__table table table_classic table_product">
                <tbody data-cart-output>
                <tr class="table__header table__row" data-sort-header>
                    <th class="table__col">Изображение</th>
                    <th class="table__col table__col_big" data-sort="title">Название
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col table__col_small" data-sort="maker">Производитель
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col table__col_ultra-small" data-sort="price">Цена
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col table__col_small" data-sort="provider">Поставщик
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col table__col_small" data-sort="stock">Склад
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col table__col_small" data-sort="count">Количество
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col table__col_small" data-sort="popularity">Покупок
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col table__col_ultra-small">Изменить</th>
                </tr>
                ${products.map(product => {
                    return html`
                        <tr class="table__row">
                            <th class="table__col table__col_image">
                                <img class="table_product-image" src="/${product.image || 'img/assets/no_photo.jpg'}" alt="${product.title}">
                            </th>
                            <th class="table__col table__col_big">${product.title}</th>
                            <th class="table__col table__col_small">${product.maker}</th>
                            <th class="table__col table__col_ultra-small">${product.price} ₽</th>
                            <th class="table__col table__col_small">${product.provider}</th>
                            <th class="table__col table__col_small">${product.stock}</th>
                            <th class="table__col table__col_small">${product.count}</th>
                            <th class="table__col table__col_small">${product.popularity || 'Неизвестно'}</th>
                            <th class="table__col table__col_ultra-small table__col_right">
                                <a class="button button_mini button_accent button_icon-only"
                                   data-state="categories"
                                   data-type="menu"
                                   href="/admin/catalog/products/edit?id=${product._id}">
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

export const renderEditProductsAdmin = ({ product }) => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Редактирование товара</h2>
                <a href="/products/${product._id}" class="button button_backwards-accent button_icon">
                    Посмотреть на страницу товара
                    <svg>
                        <use xlink:href="img/svg/sprite.svg#arrow"></use>
                    </svg>
                </a>
                </a>
            </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                <input type="text" name="id" class="v-hidden" value="${product._id}">
                ${renderAdminProductForm(product)}
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
                    <a class="button button_neutral button_icon"
                       data-state="products"
                       data-type="menu"
                       href="/admin/catalog/products">
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

export const renderAddProductsAdmin = () => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Добавление товара</h2>
                <div class="admin-panel__copy">
                    <button class="button button_backwards-accent button_icon" data-copy-button>
                        Скопировать продукт
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#copy"></use>
                        </svg>
                    </button>
                </div>
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
                        <div class="entry-input entry-input_icon entry-input_req entry-input_complete">
                            <input type="text" name="maker" class="entry-input__field" autocomplete="off" data-maker/>
                            <ul class="entry-input__complete">
                            </ul>
                        </div>
                        <div class="field-block__undertext">Введите новое значение или выберите существующее.</div>
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
                        <div class="field-block__undertext">Выберите существующее значение.</div>
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
                        <div class="field-block__undertext">Выберите существующее значение.</div>
                        <div class="field-block__undertext_error"></div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Выберите какое описание у продукта</b>
                            <div class="field-block__link"></div>
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
                        <div class="field-block__undertext">Выберите существующее значение.</div>
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
                        <div class="field-block__undertext">Введите новое значение или выберите существующее.</div>
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
                        <div class="field-block__undertext">Введите новое значение или выберите существующее.</div>
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
                    <a class="button button_neutral button_icon"
                       data-state="products"
                       data-type="menu"
                       href="/admin/catalog/products">
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

export const renderCopyProductsAdmin = (product) => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Добавление товара</h2>
                <div class="admin-panel__copy">
                    <button class="button button_backwards-accent button_icon" data-copy-button>
                        Скопировать продукт
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#copy"></use>
                        </svg>
                    </button>
                </div>
            </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                ${renderAdminProductForm(product)}
                <div class="form__row form__bottom">
                    <button type="submit"
                            class="button button_success button_sq"
                            data-submit>
                        Добавить
                    </button>
                    <a class="button button_neutral button_icon"
                       data-state="products"
                       data-type="menu"
                       href="/admin/catalog/products">
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

export const renderAdminProductForm = (product) => {
    return html`
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
                <div class="entry-input entry-input_icon entry-input_req entry-input_complete">
                    <input type="text" name="maker" class="entry-input__field" autocomplete="off" value="${product.maker}" data-maker/>
                    <ul class="entry-input__complete">
                    </ul>
                </div>
                <div class="field-block__undertext">Введите новое значение или выберите существующее.</div>
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
                <div class="field-block__undertext">Выберите существующее значение.</div>
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
                <div class="field-block__undertext">Выберите существующее значение.</div>
                <div class="field-block__undertext_error"></div>
            </div>
        </fieldset>
        <fieldset class="form__row">
            <div class="form__block field-block">
                <div class="field-block__header">
                    <b class="field-block__title">Выберите какое описание у продукта</b>
                    <div class="field-block__link"></div>
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
                <div class="field-block__undertext">Выберите существующее значение.</div>
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
                <div class="field-block__undertext">Введите новое значение или выберите существующее.</div>
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
                <div class="field-block__undertext">Введите новое значение или выберите существующее.</div>
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
                        <input type="file" accept=".jpg,.jpeg,.png,.webp" data-file-input>
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
    `
}