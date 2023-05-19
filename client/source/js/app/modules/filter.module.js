import MultiSelectComponent from '../../core/components/selectsinputs/multiselect.input.component.js'
import { debounce, sanitalize } from '../utils/utils.js'
import { html } from 'code-tag'


class FilterModule {
    constructor(root, query) {
        this.$node = document.querySelector(root)
        this.$filtersList = document.querySelector(query)
        this.data = null
        this.$fieldTitle = null
        this.currentFilters = []
        this.selectsList = []
    }

    init({ data, changeState, onRenderFilter }) {
        this.changeState = changeState
        this.onRenderFilter = onRenderFilter
        this.renderFilters(data)
    }

    initialState() {
        this.parseCheckboxes()
        this.parseSelects()
        this.parseInputTitle()
        this.renderFilterList(true)
    }

    parseInputTitle() {
        this.$fieldTitle.value = this.currentFilters.find(filter => filter.type === 'name')?.value || ''
    }

    searchHandler(e) {
        this.currentFilters = this.currentFilters.filter(filter => filter.type !== 'name')
        if (e.target.value.trim()) {
            this.addFilterItem({
                type: 'name',
                value: sanitalize(e.target.value),
                label: 'Поиск по наименованию'
            })
        }
        this.renderFilterList()
    }

    parseCheckboxes() {
        this.currentFilters.forEach(item => {
            let $checkbox = document.querySelector(`[data-filter="${item.type}"] [data-checkbox="${item.value}"]`)
            if ($checkbox) {
                $checkbox.checked = true
            }
        })
    }

    parseSelects() {
        this.currentFilters.forEach(item => {
            const select = this.selectsList.find(select => item.type === select.type)
            if (select && select.hasItem(item.value)) {
                select.selectItem(item.value, false)
            }
        })
    }

    handlerClickMore(target) {
        if (target.dataset.filterMore !== undefined) {
            const $parentList = target.closest('.filter-block__list')
            $parentList.classList.toggle('filter-block__list_full')
            if (target.textContent.trim() === 'Еще') {
                target.textContent = 'Свернуть'
                target.classList.add('filter-block__more_hide')
            } else {
                target.classList.remove('filter-block__more_hide')
                target.textContent = 'Еще'
            }
        }
    }

    handlerCheckboxChange(target) {
        const type = target.closest('.filter-block__list').dataset.list
        const value = target.dataset.checkbox
        if (target.checked) {
            this.addFilterItem({ type, value })
        } else {
            this.removeFilterItem({ type, value })
        }
        this.renderFilterList()
    }

    handlerFilterListClick(target) {
        if (target.closest('[data-filter-close]')) {
            const $parent = target.closest('.filters__item')
            const type = $parent.querySelector('.filters__key').dataset.filterType
            const value = $parent.querySelector('.filters__value').dataset.filterValue
            this.removeFilterItem({
                type,
                value
            })
            this.renderFilterList()
        }
        if (target.closest('[data-filter-reset]')) {
            this.currentFilters.forEach(filter => {
                this.removeFilterItem(filter)
            })
            this.renderFilterList()
        }
    }

    initHandlers() {
        this.$fieldTitle = document.querySelector('[data-filter="name"]')
        this.$node.addEventListener('click', ({ target }) => {
            this.handlerClickMore(target)
        })
        this.$node.querySelectorAll('.checkbox__input').forEach(checkbox => {
            checkbox.addEventListener('change', ({ target }) => {
                this.handlerCheckboxChange(target)
            })
        })
        this.$filtersList.addEventListener('click', ({ target }) => {
            this.handlerFilterListClick(target)
        })
        const inputWithDebounce = debounce(this.searchHandler.bind(this), 800)
        this.$fieldTitle.addEventListener('input', (e) => {
            inputWithDebounce(e)
        })
    }

    addFilterItem(data) {
        this.currentFilters.push(data)
    }

    removeFilterItem({ type, value }) {
        this.currentFilters = this.currentFilters.filter(filter => filter.value !== value && filter.key !== type)
        const $checkbox = this.$node.querySelector(`[data-filter='${type}'] [data-checkbox='${value}']`)
        if ($checkbox) $checkbox.checked = false
        const select = this.selectsList.find(select => select.type === type)
        if (select) select.removeItem(value, false)
        this.parseInputTitle()
    }

    renderFilterList(initialState = false) {
        this.$filtersList.innerHTML = ''
        let view = ''
        this.currentFilters.forEach(filter => {
            view += html`
                <li class="filters__item">
                    <span class="filters__key" data-filter-type="${filter.type}">${filter.label || filter.type}</span>
                    <span class="filters__value" data-filter-value="${filter.value}">${filter.value}</span>
                    <span class="filters__close" data-filter-close="true">
                             <svg>
                                 <use xlink:href="img/svg/sprite.svg#close"></use>
                             </svg>
                         </span>
                </li>`
        })
        if (this.currentFilters.length) {
            view += '<li class="filter__item-reset" data-filter-reset="true">Сбросить все фильтры</li>'
        }
        if (!initialState) this.changeState(this.currentFilters)
        this.$filtersList.insertAdjacentHTML('beforeend', view)
    }

    get allowedKeys() {
        const keys = []
        document.querySelectorAll('[data-filter]').forEach(node => {
            if (node.dataset.filter) keys.push(node.dataset.filter)
        })
        return keys
    }

    renderFilters(data) {
        this.data = data
        this.renderHeader()
        if (data.maker.length >= 2) {
            this.renderList({
                key: 'Марка',
                attrs: data.maker
            })
        }
        const lists = []
        const selects = []
        for ( const key in data.attributes ) {
            const filterItem = {
                key,
                attrs: data.attributes[key].list
            }
            if (data.attributes[key].list.length < 2) {
            } else if (data.attributes[key].type === 'list') {
                lists.push(filterItem)
            } else {
                selects.push(filterItem)
            }
        }
        lists.forEach(list => this.renderList(list))
        selects.forEach(select => this.renderSelect(select))
        this.initHandlers()
        this.onRenderFilter()
    }

    renderHeader() {
        let view = ''
        view += html`
            <div class="page-filter__block filter-block">
                <div class="filter-block__header">
                    <b class="filter-block__name">Поиск по наименованию</b>
                </div>
                <div class="filter-block__body">
                    <div class="entry-input">
                        <input type="text" name="name" placeholder="Введите текст" class="entry-input__field" data-filter="name"/>
                    </div>
                </div>
            </div>
        `
        this.$node.innerHTML += view
    }


    renderList({ key, attrs }) {
        attrs = attrs.sort((prev, next) => {
            const a = +prev.match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)
            const b = +next.match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)
            if (a === b && a === 0) {
                if (prev > next) {
                    return 1
                } else if (prev < next) {
                    return -1
                }
                return 0
            }
            return a - b
        })
        let view = ''
        view += html`
            <div class="page-filter__block filter-block" data-filter="${key}">
                <div class="filter-block__header">
                    <b class="filter-block__name">${key}</b>
                </div>
                <ul class="filter-block__list" data-list="${key}">
                    ${attrs.reduce((acc, attr, index) => {
                        acc += html`
                            <li class="filter-block__item">
                                <label class="checkbox">
                                    <input class="checkbox__input" type="checkbox" data-checkbox="${attr}"/>
                                    <span class="checkbox__view">
                                                    <svg>
                                                        <use xlink:href="img/svg/sprite.svg#yes-fit"></use>
                                                    </svg>
                                                </span>
                                    <span class="checkbox__title">${attr}</span>
                                </label>
                            </li>`

                        return acc
                    }, '')}
                    ${attrs.length > 5 ? '<li class="filter-block__item filter-block__item_more"><button type="button" class="filter-block__more" data-filter-more>Еще</button></li>' : ''}
                </ul>
            </div>
        `
        this.$node.insertAdjacentHTML('beforeend', view)
    }

    renderSelect({ key, attrs }) {
        const view = html`
            <div class="page-filter__block filter-block">
                <div class="filter-block__header">
                    <b class="filter-block__name">${key}</b>
                </div>
                <div class="select select_multi-input" data-filter="${key}" data-select="${key}">
                    <div class="select__header">
                        <input type="text" class="select__field" placeholder="Введите наименование" data-input/>
                        <span class="select__arrow" data-select-arrow></span>
                    </div>
                    <ul class="select__added-list" data-select-list>

                    </ul>
                    <ul class="select__body" data-select-body>

                    </ul>
                </div>
            </div>
        `

        this.$node.insertAdjacentHTML('beforeend', view)

        const multiSelect = new MultiSelectComponent({
            type: key,
            query: `[data-select='${key}']`,
            optionList: attrs.sort().map(item => {
                return {
                    dataset: key,
                    value: item
                }
            }),
            addObserver: (data) => {
                this.addFilterItem(data)
                this.renderFilterList()
            },
            deleteObserver: (data) => {
                this.removeFilterItem(data)
                this.renderFilterList()
            }
        })
        multiSelect.init()
        multiSelect.render()
        this.selectsList.push(multiSelect)
    }

    showPreloader() {
        this.$node.querySelector('.page-filter__preloader').classList.add('page-filter__preloader_active')
    }

    removePreloader() {
        this.$node.querySelector('.page-filter__preloader').classList.remove('page-filter__preloader_active')
    }
}

export default FilterModule


