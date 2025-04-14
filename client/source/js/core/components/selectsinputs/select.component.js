
export default class SelectComponent {
    constructor({ query, data, onselect, key }) {
        this.onselect = onselect || new Function
        this.data = data
        this.selector = query
        this.key = key
        this.isRendered = false
        this.disabled = false
        this.focusedValue = null
        this.$select = document.querySelector(query)
        this.$header = this.$select.querySelector('.select__header')
        this.$field = this.$select.querySelector('.select__title')
        this.$body = this.$select.querySelector('.select__body')
        this.$select.setAttribute('tabindex', 0)
    }

    bindMethods() {
        [
            'focusState',
            'blurState',
            'open',
            'close',
            'toggle',
            'handleKeyPress'
        ].forEach(fn => this[fn] = this[fn].bind(this))
    }


    init() {
        this.bindMethods()
        this.$select.addEventListener('focus', this.focusState)
        this.$select.addEventListener('blur', this.blurState)
        this.$header.addEventListener('click', this.toggle)
        this.registerHandlers()
    }

    focusState() {
        this.$select.addEventListener('keydown', this.handleKeyPress)
    }

    handleKeyPress(e) {
        switch (e.code) {
            case 'Enter': {
                e.preventDefault()
                if(this.isOpen()) {
                    this.blurState()
                    this.onselect(
                        {
                            text: this.getTitle(),
                            value: this.getValue()
                        },
                        this.$field
                    )
                } else {
                    this.open()
                }
                break
            }
            case 'Tab': {
                if(!e.shiftKey && this.isOpen()) {
                    e.preventDefault()
                    this.moveFocus(1)
                }
                break
            }
            case 'Escape': {
                this.blurState()
                break
            }
            case 'ArrowUp': {
                e.preventDefault()
                this.moveFocus(-1)
                break
            }

            case 'ArrowDown': {
                e.preventDefault()
                this.moveFocus(1)
                break
            }
        }
    }

    moveFocus(direction) {
        if(!this.data.length) return
        const currentIndex = this.data.findIndex(item => item.value === this.focusedValue)
        let newIndex = currentIndex + direction
        if(newIndex >= this.data.length) {
            newIndex = 0
        }
        if (newIndex >= 0) {
            this.changeState(this.data[newIndex].dataset)
            this.$items[newIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }

    blurState() {
        this.$select.removeEventListener('keydown', this.handleKeyPress)
        this.close()
    }

    toggle() {
        if (!this.disabled) this.$select.classList.toggle('select_active')
    }

    isOpen() {
        return this.$select.classList.contains('select_active')
    }

    open() {
        if (!this.disabled) this.$select.classList.add('select_active')
    }

    close() {
        this.$select.classList.remove('select_active')
        this.$select.blur()
    }


    registerHandlers() {
        this.$items = this.$body.querySelectorAll('.select__item')
        this.$items.forEach(item => {
            item.addEventListener('click', () => this.selectItem(item))
        })
    }

    selectItem(item) {
        this.$items.forEach(el => el.classList.remove('select__item_current'))
        item.classList.add('select__item_current')

        this.data.forEach(d => d.isSelected = false)
        const selectedData = this.data.find(d => d.dataset === item.dataset.value)
        if (selectedData) selectedData.isSelected = true

        this.setTitle(item.textContent)
        if (this.onselect) {
            this.removeError()
            this.onselect(
                {
                    text: item.value || item.textContent,
                    value: item.dataset.value
                },
                this.$field
            )
        }
        this.close()
    }

    render() {
        this.renderBody()
        if (!this.isRendered) {
            this.init()
            this.isRendered = true
        } else {
            this.registerHandlers()
        }
        const selectedItem = this.data.find(item => item.isSelected)
        if (selectedItem) this.setTitle(selectedItem.value)
    }

    renderBody() {
        if (this.disabled) return
        this.$body.innerHTML = this.data.length ?
            this.data.map(item => `<li class="select__item${item.isSelected ? ' select__item_current' : ''}" data-value="${item.dataset}">${item.value}</li>`).join('') :
            '<div class="select__notfound">Ничего не найдено...</div>'
    }

    changeState(value) {
        this.data.forEach(d => {
            d.isSelected = d.dataset === value
        })
        this.render()
    }

    setTitle(text) {
        this.$field.textContent = text
        this.data.forEach(d => d.isSelected = d.value === text)
        this.$items.forEach(el => el.classList.remove('select__item_current'))
        const selectedItem = Array.from(this.$items).find(el => el.dataset.value === this.getValue())
        if (selectedItem) selectedItem.classList.add('select__item_current')
        this.focusedValue = text
    }

    setValue(dataset) {
        this.data.forEach(d => d.isSelected = d.dataset === dataset)
    }

    getValue() {
        return this.data.find(d => d.isSelected)?.dataset || null
    }

    getTitle() {
        return this.data.find(d => d.isSelected)?.value
    }

    showError(text) {
        const $error = this.$select.closest('.field-block')?.querySelector('.field-block__undertext_error')
        if ($error) $error.innerHTML = text
    }

    removeError() {
        const $error = this.$select.closest('.field-block')?.querySelector('.field-block__undertext_error')
        if ($error) $error.innerHTML = ''
    }
}
