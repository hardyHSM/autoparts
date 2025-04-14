import { debounce, decodeString, sanitalize } from '../../app/utils/utils.js'
import { InputValidation } from '../components/selectsinputs/input.component.js'
import ValidationComponent from '../components/validation.component.js'
import SelectInputComponent from '../components/selectsinputs/select.input.component.js'

class FilterProvider {
    constructor(config) {
        this.router = config.router
        this.data = config.data
        this.onChangeState = config.onChangeState || new Function()
        this.$root = document.querySelector(config.root)
        this.$fields = this.$root.querySelectorAll('[data-filter]')
        this.inputs = []
    }

    init() {
        this.inputWithDebounce = debounce(this.searchHandler.bind(this), 800)
        this.initRoutes()

        this.$fields.forEach(field => {
            if (field.dataset.filterOrder) {
                this.inputs.push(new InputValidation({
                    node: field,
                    validationFunc: ValidationComponent.isValidOrder
                }))
            }
            field.addEventListener('input', ({ target }) => {
                if (target.dataset.filterOrder) {
                    const inputComponent = this.inputs.find(input => input.$field === target)
                    if (!target.value.length) {
                        inputComponent.removeError()
                    }
                    if (!inputComponent.checkValidation() && target.value.length) {
                        inputComponent.setError()
                        return
                    }
                }
                this.inputWithDebounce(target)
            })
        })
    }

    initRoutes() {
        try {
            const params = {}
            document.querySelectorAll('[data-filter]').forEach(f => {
                params[f.dataset.filter] = this.router.getParam(f.dataset.filter) || ''
            })
            Object.entries(params).forEach(([value, type]) => {
                if (!value || !type) return
                const input = document.querySelector(`[data-filter=${value}]`)
                input.value = decodeString(type) || ''
            })
        } catch (e) {
            console.error(e)
        }
    }

    searchHandler(target) {
        const value = target.value
        const type = target.dataset.filter
        this.setFilterState(value, type)
        this.router.removeParam('page')
        this.onChangeState()
    }

    setFilterState(value, type) {
        if (value) {
            this.router.addParams(type, sanitalize((value)))
        } else {
            this.router.removeParam(type)
        }
        this.router.redirectUrlState()
    }
}


export default FilterProvider