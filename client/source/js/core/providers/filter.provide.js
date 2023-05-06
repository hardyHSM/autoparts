import { debounce, decodeString, sanitalize } from '../../app/utils/utils.js'
import { InputValidation } from '../components/selects.inputs/input.component.js'
import ValidationComponent from '../components/validation.component.js'

class FilterProvide {
    constructor(config) {
        this.router = config.router
        this.onChangeState = config.onChangeState || new Function()
        this.$root = document.querySelector(config.root)
        this.$fields = this.$root.querySelectorAll('[data-filter]')
        this.inputs = []
    }

    init() {
        this.initRoutes()
        const inputWithDebounce = debounce(this.searchHandler.bind(this), 800)
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
                        return
                    }
                    if (!inputComponent.checkValidation()) {
                        inputComponent.setError()
                        return
                    }
                }
                inputWithDebounce(target)
            })
        })
    }

    initRoutes() {
        try {
            const params = {
                title: decodeString(this.router.getParam('title') || ''),
                maker: decodeString(this.router.getParam('maker') || ''),
                count: decodeString(this.router.getParam('count') || ''),
                popularity: decodeString(this.router.getParam('popularity') || '')
            }
            Object.entries(params).forEach(([value, type]) => {
                if (!value || !type) return
                document.querySelector(`[data-filter=${value}]`).value = decodeString(type) || ''
                this.setFilterState(type, value)
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
        if (value && value.length) {
            this.router.addParams(type, sanitalize((value)))
        } else {
            this.router.removeParam(type)
        }
        this.router.redirectUrlState()
    }
}


export default FilterProvide