export default class NumberSelectComponent {
    constructor({ node = null, query, onChange = null }) {
        this.node = node || document.querySelector(query)
        this.fieldValue = this.node.querySelector('[data-value]')
        this.button_plus = this.node.querySelector('[data-incr]')
        this.button_minus = this.node.querySelector('[data-decr]')
        this.onChange = onChange
    }

    init() {
        this.button_plus.addEventListener('click', () => {
            const value = this.fieldValue.textContent
            let prevRes = +value + 1
            if (prevRes < 100) {
                this.fieldValue.textContent = prevRes
                if(this.onChange) this.onChange(this.node, this.getValue())
            }
        })
        this.button_minus.addEventListener('click', () => {
            const value = this.fieldValue.textContent
            let prevRes = +value - 1
            if (prevRes > 0) {
                this.fieldValue.textContent = prevRes
                if(this.onChange) this.onChange(this.node, this.getValue())
            }
        })
    }

    getValue() {
        return +this.fieldValue.textContent
    }
}