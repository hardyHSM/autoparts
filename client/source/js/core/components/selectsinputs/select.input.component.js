import SelectComponent from './select.component.js'
import { debounce } from '../../../app/utils/utils.js'
import { html } from 'code-tag'

class SelectInputComponent extends SelectComponent {
    constructor(config) {
        super(config)
        this.title = config.title
        this.link = config.link  || ''
        this.key = config.key
        this.isSelected = false
        this.onselect = new Function()
        this.dynamicData = config.dynamicData || null
        this.$parent = this.$select.closest('.field-block') || this.$select.parentNode
    }

    async init() {
        await this.parseDynamicData(this.$title.value)
        if (this.$title.value.length) {
            this.isSelected = true
        }
        this.$header.addEventListener('click', async e => {
            await this.parseDynamicData(this.$title.value)
            this.open()
            this.renderBody(this.data)
            this.registerHandlers()
        })
        document.body.addEventListener('click', e => {
            if (!e.target.closest(this.selector)) {
                this.close()
            }
        })
        const inputWithDebounce = debounce(this.searchHandler.bind(this), 200)
        this.$title.addEventListener('input', ({ target }) => {
            if (this.dynamicData) {
                inputWithDebounce(target)
            } else {
                this.searchHandler(target)
            }

        })
        this.$title.addEventListener('blur', () => {
            if (!this.isSelected) {
                this.onselect({
                    value: null,
                    text: null
                })
                this.setTitle('')
                // if (this.dynamicData) {
                //     this.data = []
                // }
            }
        })
    }

    async searchHandler(target) {
        if(this.link) {
            this.setEditLink(null)
        }
        await this.parseDynamicData(target.value)
        let searchData
        if (!target.value.length && this.dynamicData) {
            searchData = []
        } else {
            searchData = target.value.length ?
                this.data.filter(({ value }) => value.match(new RegExp(`${target.value}`, 'gmi'))) :
                this.data
        }
        this.isSelected = false
        this.renderBody(searchData)
        this.open()
        this.registerHandlers()
    }

    renderBody(data) {
        if (this.disabled) return
        this.$body.innerHTML = ''
        if (!data.length) {
            this.$body.innerHTML = '<div class="select__notfound">Ничего не найдено...</div>'
        }
        data.map(item => {
            if (item.default) {
                this.$body.innerHTML += `<li class="select__item select__item_current" data-value="${item.dataset}" title="${item.value}"d>${item.value}</li>`
            } else {
                this.$body.innerHTML += `<li class="select__item" data-value="${item.dataset}" title="${item.value}">${item.value}</li>`
            }
        })
    }

    async parseDynamicData(value) {
        if (this.dynamicData) {
            if(value.length) {
                this.data = await this.dynamicData(value)
                const index = this.data.findIndex(item => item.value === value)
                if (index > -1) {
                    this.data[index].default = true
                    if(this.link) {
                        this.setEditLink()
                    }
                }
            } else {
                this.data = []
            }
        }
    }

    setEditLink(value = true) {
        this.$parent.querySelector('.field-block__link').innerHTML = value ? html`
            <a href="${this.link}${this.getValue()}" class="page-link">Редактировать</a>
        ` : ''
    }

    disable() {
        this.setTitle('')
        this.$title.disabled = true
        this.disabled = true
        this.$select.classList.add('select_disabled')
    }

    enable() {
        this.$title.disabled = false
        this.disabled = false
        this.$select.classList.remove('select_disabled')
    }

    setTitle(value = '') {
        this.isSelected = true
        this.$title.value = value

        this.data = this.data.map(item => {
            item.default = false
            return item
        })
        if (!value) {
            this.isSelected = false
            this.$items?.forEach(element => {
                element.classList.remove('select__item_current')
            })
            return
        } else {
            this.enable()
        }
        const index = this.data.findIndex(item => item.value === value)
        if (index >= 0) {
            this.data[index].default = true
            if(this.link) {
                this.setEditLink()
            }
        }
    }
}


export default SelectInputComponent