import SelectComponent from './select.component.js'
import { debounce } from '../../../app/utils/utils.js'

class SelectInputComponent extends SelectComponent {
    constructor(config) {
        super(config)
        this.title = config.title
        this.link = config.link || ''
        this.key = config.key
        this.req = config.req ?? true
        this.isSelected = false
        this.dynamicData = config.dynamicData || { state: null }
        this.filteredData = this.data
        this.$parent = this.$select.closest('.field-block') || this.$select.parentNode
        this.$select.setAttribute('tabindex', -1)
    }

    bindMethods() {
        super.bindMethods();
        [
            'searchHandler',
            'filterData',
            'openHandler',
            'onselect',
            'moveFocus',
            'blurState',
            'parseDynamicData'
        ].forEach(fn => this[fn] = this[fn].bind(this))
    }

    blurState() {
        if (this.link) {
            this.setEditLink()
        }
        if (!this.isSelected) {
            this.onselect({ value: null, text: null }, this.$field)
            this.setTitle('')
        } else {
            this.onselect({ value: this.getValue(), text: this.getTitle() }, this.$field)
        }
        this.close()
    }

    setData(data) {
        this.data = data
        this.filteredData = data
    }

    async init() {
        this.bindMethods()
        this.$field.addEventListener('focus', this.focusState)
        this.$field.addEventListener('blur', (e) => {
            if(e.relatedTarget !== this.$select) {
                this.blurState()
            }
        })
        this.$field.addEventListener('click', this.openHandler)
        if(!this.dynamicData.state) {
            this.$field.addEventListener('input', this.searchHandler)
        } else {
            await this.parseDynamicData(this.$field.value)
            this.setSelected(this.$field.value)
            if(this.link) this.setEditLink()
            this.$field.addEventListener('input', debounce(this.searchHandler.bind(this), 200))
        }
        if (this.$field.value.length) {
            this.isSelected = true
        }
    }

    open() {
        if (!this.disabled) this.$select.classList.add('select_active')
    }

    moveFocus(direction) {
        if(!this.filteredData.length) return
        const currentIndex = this.filteredData.findIndex(item => item.value === this.focusedValue)
        let newIndex = currentIndex + direction

        if(newIndex >= this.filteredData.length) {
            newIndex = 0
        }
        if (newIndex >= 0) {
            this.changeState(this.filteredData[newIndex].dataset)
            this.$items[newIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }

    changeState(value, data = this.filteredData) {
        this.data.forEach(d => {
            d.isSelected = d.dataset === value
        })
        const selectedItem = this.data.find(item => item.isSelected)
        this.setTitle(selectedItem.value)
        this.renderBody(data)
    }

    filterData(field) {
        this.filteredData = field.value.length ?
            this.data.filter(({ value }) => value.match(new RegExp(`${field.value}`, 'gmi'))) :
            this.data


        this.renderBody(this.filteredData)
        this.open()
    }

    openHandler() {
        this.filterData(this.$field)
    }

    async searchHandler({ target = this.$field }) {
        this.isSelected = false
        if(this.dynamicData.state) {
            await this.parseDynamicData(this.$field.value)
            this.filterData(target)
        } else {
            this.filterData(target)
        }
    }

    renderBody(data = this.data) {
        if (this.disabled) return
        this.$body.innerHTML = ''
        if (!data.length) {
            this.$body.innerHTML = '<div class="select__notfound">Ничего не найдено...</div>'
        }
        data.map(item => {
            if (item.isSelected) {
                this.$body.innerHTML += `<li class="select__item select__item_current" data-value="${item.dataset}" title="${item.value}">${item.value}</li>`
            } else {
                this.$body.innerHTML += `<li class="select__item" data-value="${item.dataset}" title="${item.value}">${item.value}</li>`
            }
        })
        this.registerHandlers()
    }

    async parseDynamicData(value) {
        if(value === '') {
            this.setData([])
            return
        }
        const res = await this.dynamicData.func(value)
        this.setData(res)
    }

    setEditLink() {
        this.$parent.querySelector('.field-block__link').innerHTML = this.getValue() ? `
            <a href="${this.link}${this.getValue()}" class="page-link">Редактировать</a>
        ` : ''
    }

    disable() {
        this.setTitle('')
        this.$field.disabled = true
        this.disabled = true
        this.$select.classList.add('select_disabled')
    }

    enable() {
        this.$field.disabled = false
        this.disabled = false
        this.$select.classList.remove('select_disabled')
    }

    setFieldValue(value = '') {
        this.$field.value = value
    }

    setUnSelected() {
        this.data = this.data.map(item => {
            item.isSelected = false
            return item
        })
        this.isSelected = false
    }

    setSelected(value) {
        this.data.forEach(d => d.isSelected = d.value === value)
        const selected = this.data.find(d => d.isSelected === true)
        if(selected) {
            this.isSelected = true
        }
    }

    setTitle(value = '') {
        this.setFieldValue(value)
        if (!value) {
            this.setUnSelected()
            return
        }
        this.setSelected(value)
        this.focusedValue = value
        if (this.link) {
            this.setEditLink()
        }
    }
}


export default SelectInputComponent