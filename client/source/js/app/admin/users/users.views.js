import { html } from 'code-tag'
import { parseDate } from '../../utils/utils.js'

export const renderUsersContentAdmin = (data) => {
    return `
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Пользователи
                    <strong class="admin-panel__count">(найдено - ${data.users.count})</strong>
                </h2>
            </div>
            <div class="filter-bar" data-filter-bar>
                <div class="filter-bar__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Имя</b>
                    </div>
                    <div class="entry-input">
                        <input type="text" name="firstName" class="entry-input__field" placeholder="Иван" data-filter="firstName"/>
                    </div>
                </div>
                <div class="filter-bar__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Фамилия</b>
                    </div>
                    <div class="entry-input">
                        <input type="text" name="lastName" class="entry-input__field" placeholder="Иванов" data-filter="lastName"/>
                    </div>
                </div>
                <div class="filter-bar__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Почта</b>
                    </div>
                    <div class="entry-input">
                        <input type="text" name="email" class="entry-input__field" placeholder="ivanov@mail.ru" data-filter="email"/>
                    </div>
                </div>
                <div class="filter-bar__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Телефон</b>
                    </div>
                    <div class="entry-input">
                        <input type="text" name="tel" class="entry-input__field" placeholder="+7 (555) 555-55-55" data-filter="tel"/>
                    </div>
                </div>
            </div>
            <table class="admin-panel__table table table_classic">
                <tbody>
                <tr class="table__header table__row" data-sort-header>
                    <th class="table__col" data-sort="createdAt">Время создания
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col" data-sort="firstName">Имя
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col" data-sort="lastName">Фамилия
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col">Почта</th>
                    <th class="table__col">Телефон</th>
                    <th class="table__col table__col_small">Локация</th>
                    <th class="table__col table__col_ultra-small">Изменить</th>
                </tr>
                ${data.users.list.map(user => {
                    return `
                        <tr class="table__row">
                            <th class="table__col">${parseDate(user.createdAt)}</th>
                            <th class="table__col">${user.firstName}</th>
                            <th class="table__col">${user.lastName}</th>
                            <th class="table__col">${user.email}</th>
                            <th class="table__col">${user.tel}</th>
                            <th class="table__col table__col_small  ">${user.location?.name || 'Неизвестно'}</th>
                            <th class="table__col table__col_ultra-small">
                                <a class="button button_mini button_accent button_icon-only"
                                   data-state="categories"
                                   data-type="menu"
                                   href="/admin/users/users/edit?id=${user._id}">
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
        </div>
    `
}

export const renderEditUsersAdmin = (data) => {
    return `
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Редактирование аккаунта пользователя</h2>
            </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                <input type="text" name="id" class="v-hidden" value="${data._id}">
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Имя</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="firstName" class="entry-input__field" value="${data.firstName}" data-name/>
                        </div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Фамилия</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="lastName" class="entry-input__field" value="${data.lastName || ''}" data-lastname/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Телефон</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="tel" class="entry-input__field" value="${data.tel}" data-tel/>
                        </div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Почта</b>
                        </div>
                        <div class="entry-input entry-input_icon entry-input_req">
                            <input type="text" name="email" class="entry-input__field" value="${data.email}" data-email/>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Активирован</b>
                        </div>
                        <div class="select" data-select-activation>
                            <div class="select__header">
                                <span class="select__title"></span>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                    </div>
                    <div class="form__block field-block">
                        <div class="field-block__header">
                            <b class="field-block__title">Роль</b>
                        </div>
                        <div class="select" data-select-role>
                            <div class="select__header">
                                <span class="select__title"></span>
                            </div>
                            <ul class="select__body">
                            </ul>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__row">
                    <div class="pick-location">
                        <span class="pick-location__address" data-address="${data.location?._id || '64208ba5c733d0205fd14c35'}">${data.location?.name || 'г. Луганск'}</span>
                        <button type="button" class="pick-location__change">Выбрать другой пункт</button>
                    </div>
                </fieldset>
                <div class="form__row form__bottom">
                    <button type="submit"
                            class="button button_success button_sq"
                            data-submit>
                        Изменить
                    </button>
                    <button type="button" class="button button_danger button_icon button_mini" data-user-delete>
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#trash"></use>
                        </svg>
                        Удалить аккаунт
                    </button>
                    <a class="button button_neutral button_icon"
                       data-state="users"
                       data-type="menu"
                       href="/admin/users/users">
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
