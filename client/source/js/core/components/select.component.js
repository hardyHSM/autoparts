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
    }
    init() {
        this.$header.addEventListener('click', e => {
            if(this.$select.classList.contains('select_active')) {
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
                    this.onselect({
                        text: this.getValue(),
                        value: element.dataset.value
                    })
                }
                this.close()
            })
        })
    }
    render() {
        this.$body.innerHTML = ''
        this.setTitle(this.data.find(item => item.default === true).value)
        this.data.map(item => {
            if(item.default) {
                this.$body.innerHTML += `<li class="select__item select__item_current" data-value='${item.dataset}'>${item.value}</li>`
            } else {
                this.$body.innerHTML += `<li class="select__item" data-value='${item.dataset}'>${item.value}</li>`
            }
        })
        if(!this.isRendered) {
            this.init()
            this.isRendered = true
        } else {
            this.registerHandlers()
        }
    }
    changeState(value) {
        const index = this.data.findIndex(item => item.dataset === value)
        if(index < 0) {
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
        this.$select.classList.add('select_active')
    }
    close() {
        this.$select.classList.remove('select_active')
    }
    getValue() {
        return this.$body.querySelector('.select__item_current').dataset.value
    }
}
