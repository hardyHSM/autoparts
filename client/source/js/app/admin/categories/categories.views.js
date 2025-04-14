import { html } from 'code-tag'
import { categoriesConfig } from './categories.model.js'

export const renderCategoriesAdmin = (categories) => {
    return `
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">
                    Категории
                    <strong class="admin-panel__count">(всего - ${categories.length})</strong>
                </h2>
                <div class="admin-panel__controls">
                    <a class="button button_backwards-accent button_icon"
                       data-type="menu"
                       data-state="${categoriesConfig.states.general}"
                       href="${categoriesConfig.router.add}">
                        Добавить
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#add"></use>
                        </svg>
                    </a>
                </div>
            </div>
            <table class="table table_classic">
                <tbody>
                <tr class="table__header table__row" data-sort-header>
                    <th class="table__col" data-sort="name">Имя категории <svg class="table__sort-icon"><use xlink:href="img/svg/sprite.svg#sort_down"></use></svg></th>
                    <th class="table__col">Ссылка на категорию</th>
                    <th class="table__col" data-sort="number">Приоритет категории <svg class="table__sort-icon"><use xlink:href="img/svg/sprite.svg#sort_down"></use></svg></th>
                    <th class="table__col table__col_small" data-cart-all data-enabled="false">Изменить</th>
                </tr>
                ${categories.map(category => {
                    return `
                        <tr class="table__row">
                            <th class="table__col">${category.name}</th>
                            <th class="table__col">${category.link}</th>
                            <th class="table__col">${category.number}</th>
                            <th class="table__col table__col_small table__col_right">
                                <a class="button button_mini button_accent button_icon-only"
                                   data-state="${categoriesConfig.states.general}"
                                   data-type="menu"
                                   href="${categoriesConfig.router.edit}${category._id}">
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

export const renderAddCategoryAdmin = () => {
    return `
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
                    <button type="submit"
                            class="button button_accent button_icon"
                            data-submit>
                        Добавить Категорию
                        <svg stroke="#fff" class="button__transparent">
                            <use xlink:href="img/svg/sprite.svg#upload"></use>
                        </svg>
                    </button>
                    <a
                            class="button button_neutral button_icon"
                            data-state="back"
                            data-type="menu"
                            href="${categoriesConfig.router.general}">
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

export const renderEditCategoryAdmin = (category) => {
    return `
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Изменение категории</h2>
            </div>
            <div class="admin-panel__message message message_error message_icon">
                При удалении категории, все подкатегории которые вложены будут удалены. Будьте аккуратны!
            <svg><use xlink:href="img/svg/sprite.svg#info"></use></svg>
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
                            class="button button_success button_icon"
                            data-submit>
                        Изменить категорию
                        <svg stroke="#fff" class="button__transparent">
                            <use xlink:href="img/svg/sprite.svg#upload"></use>
                        </svg>
                    </button>
                    <button type="button" class="button button_danger button_icon button_mini" data-category-delete>
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#trash"></use>
                        </svg>
                        Удалить категорию
                    </button>
                    <a class="button button_neutral button_icon"
                       data-state="back"
                       data-type="menu"
                       href="${categoriesConfig.router.general}">
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