import { InputValidation } from './input.component.js'

class InputCompleteComponent extends InputValidation {
    constructor(config) {
        super(config)
        this.id = config.id
        this.data = config.data || []
        this.changeData = config.changeData ? config.changeData.bind(this) : new Function
    }

    bindMethods() {
        [
            'focusState',
            'handleKeyPress',
            'showComplete',
            'moveFocus'
        ].forEach(fn => this[fn] = this[fn].bind(this))
    }

    init(key) {
        super.init()
        this.bindMethods()
        this.$body = this.$parent.querySelector('.entry-input__complete')

        this.$field.addEventListener('focus', this.focusState)
        this.$field.addEventListener('blur', (e) => {
            if (e.relatedTarget) {
                this.blurState()
            }
        })
        this.$field.addEventListener('click', this.showComplete)
        this.$field.addEventListener('input', this.showComplete)

        document.body.addEventListener('click', ({ target }) => {
            const condition = (target.closest('.entry-input') === this.$parent)
            if (!condition) {
                this.removeComplete()
            }
        })
        if (key) this.changeData(key)
    }

    focusState() {
        this.$parent.addEventListener('keydown', this.handleKeyPress)
        this.$body.addEventListener('click', ({ target }) => {
            const item = target.closest('.entry-input__item')
            if (item) {
                this.$field.value = item.textContent
                if (this.validation) this.checkValidation()
                this.$field.dispatchEvent(new Event('input', { bubbles: true }))
                this.removeComplete()
            }
        })
    }

    blurState() {
        this.$field.dispatchEvent(new Event('input', { bubbles: true }))
        this.removeComplete()
    }

    handleKeyPress(e) {
        switch (e.code) {
            case 'Enter': {
                e.preventDefault()
                if (this.isOpen) {
                    this.blurState()
                    if (this.validation) this.checkValidation()
                } else {
                    this.showComplete()
                }
                break
            }
            case 'Tab': {
                if (!e.shiftKey && this.isOpen) {
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
        const completeItems = this.$body.querySelectorAll('.entry-input__item')
        if (!completeItems.length) return
        const item = this.$body.querySelector('[data-index]')
        const currentIndex = +item?.dataset?.index >= 0 ? +item.dataset.index : -1
        let newIndex = currentIndex + direction

        if (newIndex >= completeItems.length) {
            newIndex = 0
        }

        if (newIndex >= 0) {
            if (item) {
                delete item.dataset.index
                item.classList.remove('entry-input__item_current')
            }
            completeItems[newIndex].dataset.index = newIndex
            completeItems[newIndex].classList.add('entry-input__item_current')
            this.$field.value = completeItems[newIndex].textContent
            completeItems[newIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            })
        }
    }


    showComplete() {
        this.isOpen = true
        let searchList = this.$field.value.length ?
            this.data.filter((value) => value.match(new RegExp(`${this.$field.value}`, 'gmi'))) :
            this.data
        this.$body.innerHTML = ''
        searchList.map((item, index) => {
            if (item === this.$field.value) {
                this.$body.innerHTML += `<li class="entry-input__item entry-input__item_current" data-index="${index}">${item}</li>`
            } else {
                this.$body.innerHTML += `<li class="entry-input__item">${item}</li>`
            }
        })
        if (!searchList.length) {
            return
        }
        this.$parent.classList.add('entry-input_active')
    }

    removeComplete() {
        this.isOpen = false
        this.$parent.classList.remove('entry-input_active')
    }
}

export default InputCompleteComponent