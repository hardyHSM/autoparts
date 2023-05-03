import { InputValidation } from './input.component.js'

class InputCompleteComponent extends InputValidation {
    constructor(config) {
        super(config)
        this.data = config.data || []
    }

    init() {
        super.init()
        this.$body = this.$parent.querySelector('.entry-input__complete')
        this.$body.addEventListener('click', ({ target }) => {
            const item = target.closest('.entry-input__item')
            if (item) {
                this.$field.value = item.textContent
                if(this.validation) this.checkValidation()
                this.removeComplete()
            }
        })
        this.$field.addEventListener('input', () => {
            this.showComplete()
        })
        this.$field.addEventListener('focus', () => {
            this.showComplete()
        })
        document.addEventListener('click', ({ target }) => {
            const condition = (target.closest('.entry-input') === this.$parent)
            if (!condition) {
                this.removeComplete()
            }
        })

    }

    showComplete() {
        let searchList = this.$field.value.length ?
            this.data.filter((value) => value.match(new RegExp(`${this.$field.value}`, 'gmi'))) :
            this.data
        this.$body.innerHTML = ''
        searchList.map(item => {
            this.$body.innerHTML += `<li class="entry-input__item">${item}</li>`
        })
        if (!searchList.length) {
            return
        }
        this.$parent.classList.add('entry-input_active')
    }

    removeComplete() {
        this.$parent.classList.remove('entry-input_active')
    }
}

export default InputCompleteComponent