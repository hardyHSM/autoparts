import SelectComponent from './select.component.js'

class SelectInputComponent extends SelectComponent {
    constructor(config) {
        super(config)
        this.title = config.title
        this.key = config.key
        this.isSelected = true
        this.onselect = new Function()
    }

    init() {
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
        this.$title.addEventListener('input', ({ target }) => {
            let searchData = target.value.length ?
                this.data.filter(({ value }) => value.match(new RegExp(`${target.value}`, 'gmi'))) :
                this.data
            this.isSelected = false
            this.renderBody(searchData)
            this.open()
            this.registerHandlers()
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
        this.data[index].default = true
    }
}


export default SelectInputComponent