import { html } from 'code-tag'
import { pagesConfig } from './pages.model.js'
import { parseDate } from '../../utils/utils.js'

export const renderPagesMenuContent = (data) => {
    data = data.sort((prev, next) => prev.order - next.order)
    return `
        <div class="admin-panel__content pages-content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Управление страницами сайта
                </h2>
                <div class="admin-panel__controls">
                    <a class="button button_backwards-accent button_icon"
                       data-type="menu"
                       data-state="${pagesConfig.states.add}"
                       href="${pagesConfig.router.add}">
                        Добавить
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#add"></use>
                        </svg>
                    </a>
                </div>
            </div>
            <form method="put" class="form admin-panel__form" data-admin-form>
                <table class="pages-table admin-panel__table table table_classic">
                <thead>
                    <tr class="table__header table__row">
                        <th class="table__col table__col_drag"></th>
                        <th class="table__col">Название страницы</th>
                        <th class="table__col">Ссылка на страницу</th>
                        <th class="table__col table__col_small">Посмотреть страницу</th>
                        <th class="table__col table__col_small">Отображение в шапке</th>
                        <th class="table__col table__col_small">Отображение в подвале</th>
                        <th class="table__col table__col_small">Изменить</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(page => {
        return html`
            <tr class="table__row" data-form-row>
                <th class="table__col table__col_small table__col_button table__col_drag" data-drag>
                    <input type="text" name="id" class="v-hidden" value="${page._id}"/>
                    <input type="text" name="order" class="v-hidden" value="${page.order}" data-order/>
                    <svg>
                        <use xlink:href="img/svg/sprite.svg#drag"></use>
                    </svg>
                </th>
                <th class="table__col">
                    <div class="entry-input entry-input_small">
                        <input type="text" name="name" class="entry-input__field" value="${page.name}" placeholder="Введите название страницы"/>
                    </div>
                </th>
                <th class="table__col">
                    <div class="entry-input entry-input_small">
                        <input type="text" name="link" class="entry-input__field" value="${page.link}" placeholder="Введите ссылку для страницы"/>
                    </div>
                </th>
                <th class="table__col table__col_small">
                    <a class="page-link page-link_icon" href="/${page.link}">
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#list"></use>
                        </svg>
                    </a>
                </th>
                <th class="table__col table__col_small">
                    <label class="checkbox table__checkbox" tabindex="0">
                        <input class="checkbox__input" type="checkbox" name="inHeader" ${page.inHeader ? 'checked' : ''}>
                        <span class="checkbox__view">
                                            <svg>
                                                <use xlink:href="img/svg/sprite.svg#yes-fit"></use>
                                            </svg>
                                        </span>
                        <span class="checkbox__title">Выбрать</span>
                    </label>
                </th>
                <th class="table__col table__col_small">
                    <label class="checkbox table__checkbox">
                        <input class="checkbox__input" type="checkbox" name="inBottom" ${page.inBottom ? 'checked' : ''}
                        ">
                        <span class="checkbox__view"">
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#yes-fit"></use>
                        </svg>
                        </button>
                        <span class="checkbox__title">Выбрать</span>
                    </label>
                </th>
                <th class="table__col table__col_small table__col_right">
                    <a class="button button_mini button_accent button_icon-only ${page.editable ? '' : 'button_disabled'}"
                       data-state="${page.editable ? `${pagesConfig.states.edit}` : 'none'}"
                       data-type="menu"
                       href="${page.editable ? `${pagesConfig.router.edit}${page._id}` : ''}">
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
            <div class="pages-content__bottom">
                <button type="submit"
                    class="button button_success button_icon"
                    data-submit>
                    Сохранить изменения
                    <svg stroke="#fff" class="button__transparent">
                        <use xlink:href="img/svg/sprite.svg#upload"></use>
                    </svg>
                </button>
            </form>
        </div>
    `
}

export const renderPagesAdmin = () => {
    return `
        <div class="tabs-pages__data" data-menu>
        </div>
    `
}

export const renderAddPagesAdmin = () => {
    return html`
        <div class="admin-panel__content pages-content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Добавление страницы
                </h2>
            </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                ${renderAdminPagesForm()}
                <div class="form__row form__bottom">
                    <button type="submit"
                            class="button button_accent button_icon button_wide"
                            data-submit>
                        Добавить
                        <svg stroke="#fff" class="button__transparent">
                            <use xlink:href="img/svg/sprite.svg#upload"></use>
                        </svg>
                    </button>
                    <a class="button button_neutral button_icon button_wide"
                       data-state="back"
                       data-type="menu"
                       href="${pagesConfig.router.general}">
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

export const renderEditPagesAdmin = (page) => {
    return html`
        <div class="admin-panel__content pages-content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Редактирование страницы
                </h2>
            </div>
           <div class="admin-panel__messages messages-list">
               <p class="message message_icon message_accent">Страница была создана в <b>${parseDate(page.createdAt)}</b>
                   <svg>
                       <use xlink:href="img/svg/sprite.svg#spanner"></use>
                   </svg>
               </p>
               <p class="message message_icon message_accent">Страница была изменена последний раз в <b>${parseDate(page.updatedAt)}</b>
                   <svg>
                       <use xlink:href="img/svg/sprite.svg#calendar"></use>
                   </svg>
               </p>
           </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                <input type="text" name="id" class="v-hidden" value="${page._id}">
                ${renderAdminPagesForm(page)}
                <div class="form__row form__bottom">
                    <button type="submit"
                            class="button button_success button_icon button_wide"
                            data-submit>
                        Изменить страницу
                        <svg stroke="#fff" class="button__transparent">
                            <use xlink:href="img/svg/sprite.svg#upload"></use>
                        </svg>
                    </button>
                    <button type="button" class="button button_danger button_icon" data-page-delete>
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#trash"></use>
                        </svg>
                        Удалить страницу
                    </button>
                    <a class="button button_neutral button_icon"
                       data-state="back"
                       data-type="menu"
                       href="${pagesConfig.router.general}">
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


const renderAdminPagesForm = (page = {}) => {
    return html`
        <fieldset class="form__row">
            <div class="form__block field-block">
                <div class="field-block__header">
                    <b class="field-block__title">Имя страницы</b>
                </div>
                <div class="entry-input entry-input_icon entry-input_req">
                    <input type="text" name="name" class="entry-input__field" value="${page.name || ''}" placeholder="Информация для посетителей" data-name/>
                </div>
            </div>
            <div class="form__block field-block">
                <div class="field-block__header">
                    <b class="field-block__title">Ссылка на страницу</b> (уникальное)
                </div>
                <div class="entry-input entry-input_icon entry-input_req">
                    <input type="text" name="link" class="entry-input__field" value="${page.link || ''}" placeholder="information" data-link/>
                </div>
            </div>
        </fieldset>
        <fieldset class="form__row">
            <div class="form__block">
                <label class="checkbox checkbox_big">
                    <span class="checkbox__title">Отображение данной страницы в шапке сайта: </span>
                    <input class="checkbox__input" type="checkbox" name="inHeader" ${page.inHeader ? 'checked' : ''}>
                    <span class="checkbox__view">
                        <svg><use xlink:href="img/svg/sprite.svg#yes-fit"></use></svg>
                    </span>
                </label>
            </div>
        </fieldset>
        <fieldset class="form__row">
            <div class="form__block">
                <label class="checkbox checkbox_big">
                    <span class="checkbox__title">Отображение данной страницы в подвале сайта: </span>
                    <input class="checkbox__input" type="checkbox" name="inBottom" ${page.inBottom ? 'checked' : ''}>
                    <span class="checkbox__view">
                        <svg><use xlink:href="img/svg/sprite.svg#yes-fit"></use></svg>
                    </span>
                </label>
            </div>
        </fieldset>
        <textarea id="editor" class="editor">

        </textarea>
    `
}