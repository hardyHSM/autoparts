import SelectComponent from './select.component.js'
import { debounce } from '../../../app/utils/utils.js'

class SelectInputComponent extends SelectComponent {
    constructor(config) {
        super(config)
        this.title = config.title
        this.key = config.key
        this.isSelected = false
        this.onselect = new Function()
        this.onchange = config?.onchange?.bind(this)
    }

    init() {
        if(this.$title.value.length) {
            this.isSelected = true
        }
        this.$header.addEventListener('click', e => {
            this.open()
            this.renderBody(this.data)
            this.registerHandlers()
        })
        document.body.addEventListener('click', e => {
            if (!e.target.closest(this.selector)) {
                this.close()
            }
        })
        const inputWithDebounce = debounce(this.searchHandler.bind(this), 800)
        this.$title.addEventListener('input', ({ target }) => {
            if(this.onchange) {
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
            }
        })
    }

    async searchHandler(target) {
        await this.onchange?.(target.value)
        let searchData = target.value.length ?
            this.data.filter(({ value }) => value.match(new RegExp(`${target.value}`, 'gmi'))) :
            this.data
        this.isSelected = false
        this.renderBody(searchData)
        this.open()
        this.registerHandlers()
    }

    renderBody(data) {
        if(this.disabled) return
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

    setTitle(value) {
        this.$title.value = value

        this.data = this.data.map(item => {
            item.default = false
            return item
        })
        if(!value) {
            this.isSelected = false
            this.$items?.forEach(element => {
                element.classList.remove('select__item_current')
            })
            return
        } else {
            this.enable()
        }
        const index = this.data.findIndex(item => item.value === value)
        console.log(this.data)
        console.log(value)
        this.data[index].default = true
    }
}


export default SelectInputComponent