export default class SelectComponent {
    constructor({ query, data, onselect }) {
        this.onselect = onselect
        this.data = data
        this.selector = query
        this.$select = document.querySelector(query)
        this.$header = this.$select.querySelector('.select__header')
        this.$title = this.$select.querySelector('.select__title')
        this.$body = this.$select.querySelector('.select__body')
        this.isRendered = false
        this.disabled = false
    }

    init() {
        this.$header.addEventListener('click', e => {
            if (this.$select.classList.contains('select_active')) {
                this.close()
            } else {
                this.open()
            }
        })
        document.body.addEventListener('click', e => {
            if (!e.target.closest(this.selector)) {
                this.close()
            }
        })
        this.registerHandlers()
    }

    registerHandlers() {
        this.$items = this.$body.querySelectorAll('.select__item')
        this.$items.forEach(element => {
            element.addEventListener('click', () => {
                this.$items.forEach(element => {
                    element.classList.remove('select__item_current')
                })
                element.classList.add('select__item_current')
                this.setTitle(element.textContent)
                if (this.onselect) {
                    this.removeError()
                    this.isSelected = true
                    this.onselect({
                        text: element.value || element.textContent,
                        value: element.dataset.value
                    })
                }
                this.close()
            })
        })
    }

    render() {
        let defaultValue = this.data.find(item => item.default === true)?.value || ''
        this.setTitle(defaultValue)
        this.renderBody(this.data)
        if (!this.isRendered) {
            this.init()
            this.isRendered = true
        } else {
            this.registerHandlers()
        }
    }

    renderBody(data) {
        if(this.disabled) return
        this.$body.innerHTML = ''
        if (!data.length) {
            this.$body.innerHTML = '<div class="select__notfound">Ничего не найдено...</div>'
        }
        data.map(item => {
            if (item.default) {
                this.$body.innerHTML += `<li class="select__item select__item_current" data-value="${item.dataset}">${item.value}</li>`
            } else {
                this.$body.innerHTML += `<li class="select__item" data-value="${item.dataset}">${item.value}</li>`
            }
        })
    }

    changeState(value) {
        const index = this.data.findIndex(item => item.dataset === value)
        if (index < 0) {
            return
        }
        this.data.forEach(item => item.default = false)
        this.data[index].default = true
        this.render()
    }

    setTitle(value) {
        this.$title.textContent = value
    }

    open() {
        if(this.disabled) return
        this.$select.classList.add('select_active')
    }

    close() {
        this.$select.classList.remove('select_active')
    }

    getValue() {
        return this.$body.querySelector('.select__item_current')?.dataset?.value
    }

    showError(text) {
        const $fieldBlock = this.$select.closest('.field-block')
        if ($fieldBlock) {
            const $error = $fieldBlock.querySelector('.field-block__undertext_error')
            if($error) $error.innerHTML = text
        }
    }
    removeError() {
        const $fieldBlock = this.$select.closest('.field-block')
        if ($fieldBlock) {
            const $error = $fieldBlock.querySelector('.field-block__undertext_error')
            if($error) $error.innerHTML = ''

        }
    }
}
