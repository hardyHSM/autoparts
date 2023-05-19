import { html } from 'code-tag'
import { parseDate } from '../../utils/utils.js'

const dictionary = {
    'original': 'оригинал',
    'any': 'любая',
    'substitute': 'заменитель',
}

export const renderSelectionAdmin = (data) => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Подбор запчастей
                    <strong class="admin-panel__count">(найдено - ${data.selections.count})</strong>
                </h2>
            </div>
            <div class="filter-bar" data-filter-bar>
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
                        <b class="field-block__title">Вин код</b>
                    </div>
                    <div class="entry-input">
                        <input type="text" name="vin" class="entry-input__field" placeholder="JTHCH96S160016167" data-filter="vin"/>
                    </div>
                </div>
                <div class="filter-bar__item field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Название детали</b>
                    </div>
                    <div class="entry-input">
                        <input type="text" name="detail" class="entry-input__field" placeholder="Двигатель" data-filter="detail"/>
                    </div>
                </div>
            </div>
            <table class="admin-panel__table table table_classic">
                <tbody>
                <tr class="table__header table__row" data-sort-header>
                    <th class="table__col" data-sort="createdAt">Время создания
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col" data-sort="email">Почта
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col" data-sort="createdAt">Название детали
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col">Вин код</th>
                    <th class="table__col" data-sort="isAnswered">Статус
                        <svg class="table__sort-icon"></svg>
                    </th>
                    <th class="table__col table__col_ultra-small">Изменить</th>
                </tr>
                ${data.selections.list.map(selection => {
                    return html`
                        <tr class="table__row">
                            <th class="table__col">${parseDate(selection.createdAt || '') || ''}</th>
                            <th class="table__col">${selection.email}</th>
                            <th class="table__col">${selection.detail}</th>
                            <th class="table__col">${selection.vin}</th>
                            <th class="table__col">
                                ${selection.isAnswered ? '<div class="success">Ответ дан</div>' : '<div class="error">Ответ отсутствует</div>'}
                            </th>
                            <th class="table__col table__col_ultra-small">
                                <a class="button button_mini button_accent button_icon-only"
                                   data-state="categories"
                                   data-type="menu"
                                   href="/admin/users/selection/edit?id=${selection._id}">
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


export const renderEditSelectionAdmin = (data) => {
    return html`
        <div class="admin-panel__content">
            <div class="admin-panel__header">
                <h2 class="admin-panel__title">Ответ на подбор запчастей от пользователя.</h2>
            </div>
            <form method="post" class="form admin-panel__form" data-admin-form>
                <div class="form__row">
                    <div class="list-data" data-properties-all>
                        <h3 class="list-data__title">Данные: </h3>
                        <dl class="list-data__list">
                            <div class="list-data__item">
                                <dt class="list-data__key">Имя:</dt>
                                <dd class="list-data__value">${data.name}</dd>
                            </div>
                            <div class="list-data__item">
                                <dt class="list-data__key">Почта:</dt>
                                <dd class="list-data__value">${data.email}</dd>
                            </div>
                            <div class="list-data__item">
                                <dt class="list-data__key">Деталь:</dt>
                                <dd class="list-data__value">${data.detail}</dd>
                            </div>
                            <div class="list-data__item">
                                <dt class="list-data__key">Тип:</dt>
                                <dd class="list-data__value">${dictionary[data.partType]}</dd>
                            </div>
                            <div class="list-data__item">
                                <dt class="list-data__key">Количество:</dt>
                                <dd class="list-data__value">${data.count}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
                <input type="text" name="id" class="v-hidden" value="${data._id}">
                <div id="editor" class="editor">

                </div>
                <div>
                    ${data.isAnswered ? `<h2>Ваш ответ:</h2><br><hr/>${data.answer}<hr/>` : ''}
                </div>
                <div class="form__row form__bottom">
                    ${!data.isAnswered ? html`
                        <button type="submit"
                                class="button button_success button_sq"
                                data-submit>
                            Ответить
                        </button>
                    ` : ''}
                    <button type="button" class="button button_danger button_icon button_mini" data-feedback-delete>
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#trash"></use>
                        </svg>
                        Удалить
                    </button>
                    <a class="button button_neutral button_icon"
                       data-state="products"
                       data-type="menu"
                       href="/admin/users/selection">
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