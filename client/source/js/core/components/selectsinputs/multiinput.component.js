import { sanitalize } from '../../../app/utils/utils.js'

class MultiInputComponent {
    constructor({ id, selector, data, complete, changeData }) {
        this.id = id
        this.$node = document.querySelector(selector)
        this.focusOnComplete = false
        this.isOpen = false
        this.$field = this.$node.querySelector('[data-input]')
        this.$list = this.$node.querySelector('[data-select-list]')
        this.$complete = this.$node.querySelector('[data-select-body]')
        this.complete = complete || []
        this.data = data
        this.changeData = changeData.bind(this) || new Function
    }

    init(key) {
        this.bindMethods()
        this.renderList()
        this.registerHandlers()
        this.changeData(key)
    }

    bindMethods() {
        [
            'focusState',
            'blurState',
            'handleKeyPress',
            'showComplete',
            'moveFocus',
            'handleCompleteClick',
            'beyondHandler',
            'blurHandler',
            'inputHandler',
            'keyDownHandler',
            'removeItemHandler'
        ].forEach(fn => this[fn] = this[fn].bind(this))
    }

    blurHandler(e) {
        if (e.relatedTarget) {
            this.blurState()
        }
    }

    beyondHandler({ target }) {
        const condition = target.closest(`[data-editor-value="${this.id}"]`) === this.$node
        if (!condition) {
            this.removeComplete()
        }
    }

    inputHandler() {
        this.focusOnComplete = false
        this.showComplete()
    }

    keyDownHandler(e) {
        if (e.code === 'Enter' && !this.focusOnComplete) {
            this.addItem(this.$field.value)
            this.renderList()
        }
    }

    removeItemHandler({ target }) {
        const item = target.closest('.select__added-item')
        if (item) {
            this.removeItem(item.textContent.trim())
            this.renderList()
        }
    }

    registerHandlers() {
        this.$field.addEventListener('focus', this.focusState)
        this.$field.addEventListener('blur', this.blurHandler)
        this.$field.addEventListener('click', this.showComplete)
        this.$field.addEventListener('input', this.inputHandler)
        document.body.addEventListener('click', this.beyondHandler)
        this.$field.addEventListener('keydown', this.keyDownHandler)
        this.$node.addEventListener('click', this.removeItemHandler)
    }

    blurState() {
        this.$node.removeEventListener('keydown', this.handleKeyPress)
        this.removeComplete()
    }

    focusState() {
        this.$node.addEventListener('keydown', this.handleKeyPress)

        this.$complete.addEventListener('click', this.handleCompleteClick)
    }

    handleCompleteClick = ({ target }) => {
        const item = target.closest('[data-select-item]')
        if (item) {
            this.addItem(item.textContent)
            this.renderList()
        }
    }

    handleKeyPress(e) {
        const actions = {
            'Enter': () => {
                if (this.focusOnComplete) {
                    this.addItem(this.focusOnComplete.textContent)
                    this.renderList()
                } else {
                    this.showComplete()
                }
            },
            'Tab': () => {
                if (!e.shiftKey && this.isOpen) {
                    e.preventDefault()
                    this.moveFocus(1)
                }
            },
            'Escape': () => this.blurState(),
            'ArrowUp': () => {
                e.preventDefault()
                this.moveFocus(-1)
            },
            'ArrowDown': () => {
                e.preventDefault()
                this.moveFocus(1)
            }
        }
        if (actions[e.code]) actions[e.code]()
    }

    moveFocus(direction) {
        const items = [...this.$complete.querySelectorAll('[data-select-item]')]
        if (!items.length) return this.focusOnComplete = false

        const currentIndex = items.indexOf(this.$complete.querySelector('.select__item_current'))
        const newIndex = (currentIndex + direction + items.length) % items.length

        items.forEach(item => item.classList.remove('select__item_current'))
        items[newIndex].classList.add('select__item_current')
        this.focusOnComplete = items[newIndex]

        items[newIndex].scrollIntoView({
            block: 'nearest',
            behavior: 'smooth'
        })
    }


    addItem(content) {
        if (!content.trim()) return
        const parsedContent = sanitalize(content)
        parsedContent.split(',').forEach(value => {
            const trimmedValue = value.trim()
            if (!this.isInData(trimmedValue)) this.data.push(trimmedValue)
        })
    }

    isInData(content) {
        return this.data.find(item => item === content.trim())
    }

    removeItem(content) {
        this.data = this.data.filter(item => item !== sanitalize(content))
    }

    renderList() {
        if (this.data.length) {
            this.showSelectedList()
        } else {
            this.hideSelectedList()
        }
        this.$list.innerHTML = ''

        this.data.forEach(content => {
            this.$list.innerHTML += `
            <li class="select__added-item">
                ${content}
                <svg>
                    <use xlink:href="img/svg/sprite.svg#close"></use>
                </svg>
            </li>
            `
        })
    }

    showComplete() {
        this.isOpen = true
        const searchList = this.$field.value.length ?
            this.complete.filter((value) => value.match(new RegExp(`${this.$field.value}`, 'gmi'))) :
            this.complete

        this.$complete.innerHTML = ''
        searchList.map((item) => {
            this.$complete.innerHTML += `<li class="select__item" data-select-item>${item}</li>`
        })
        this.$node.classList.add('select_active')
    }

    removeComplete() {
        this.isOpen = false
        this.focusOnComplete = false
        this.$node.classList.remove('select_active')
    }

    showSelectedList() {
        this.$list.classList.add('select__added-list_active')
    }

    hideSelectedList() {
        this.$list.classList.remove('select__added-list_active')
    }

    destroy() {
        this.$field.removeEventListener('focus', this.focusState)
        this.$field.removeEventListener('blur', this.blurHandler)
        this.$field.removeEventListener('click', this.showComplete)
        this.$field.removeEventListener('input', this.inputHandler)
        document.body.removeEventListener('click', this.beyondHandler)
        this.$field.removeEventListener('keydown', this.keyDownHandler)
        this.$node.removeEventListener('click', this.removeItemHandler)
        this.$list.innerHTML = ''
        this.$complete.innerHTML = ''
    }
}

export default MultiInputComponent