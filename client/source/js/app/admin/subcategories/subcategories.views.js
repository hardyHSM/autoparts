import { html } from 'code-tag'

export const renderSubcategoriesAdmin = (subcategories) => {
    return `
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">
                    Подкатегории
                    <strong class="admin-panel__count">(всего - ${subcategories.length})</strong>
                </h2>
                <div class="admin-panel__controls">
                    <a class="button button_backwards-accent button_icon"
                       data-type="menu"
                       data-state="subcategories/add"
                       href="/admin/catalog/subcategories/add">
                        Добавить
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#add"></use>
                        </svg>
                    </a>
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
        return `
                        <tr class="table__row">
                            <th class="table__col">${subcategory.name}</th>
                            <th class="table__col">${subcategory.link}</th>
                            <th class="table__col">${subcategory.category?.name || 'Категория отсутствует'}</th>
                            <th class="table__col table__col_small table__col_right">
                                <a class="button button_mini button_accent button_icon-only"
                                   data-state="subcategories"
                                   data-type="menu"
                                   href="/admin/catalog/subcategories/edit?id=${subcategory._id}">
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
        </div>`
}

export const renderEditSubcategoryAdmin = ({ subcategory }) => {
    return `
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
                    <a type="button"
                       class="button button_neutral button_icon"
                       data-state="subcategories"
                       data-type="menu"
                       href="/admin/catalog/subcategories">
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

export const renderAddSubcategoryAdmin = () => {
    return `
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
                    <a class="button button_neutral button_icon"
                       data-state="subcategories"
                       data-type="menu"
                       href="/admin/catalog/subcategories">
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