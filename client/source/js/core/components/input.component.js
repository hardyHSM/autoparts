import ValidationComponent from './validation.component.js'
import CONFIG_INPUTS from '../../app/configs/inputs.config.js'
import IMask from 'imask'
import loginModal from '../../app/modules/login.modal.js'

export class InputComponent {
    constructor({ selector, onChange, parent }) {
        this.$field = document.querySelector(selector)
        this.$parent = this.$field.closest(parent) || this.$field.parentNode
        this.isChanged = false
        this.onChange = onChange
        this.initialValue = this.$field.value
    }

    init() {
        this.$field.addEventListener('focus', this.setFocus)
        this.$field.addEventListener('blur', this.removeFocus)
    }

    clear() {
        this.$field.value = ''
    }

    setFocus() {
        this.$parent.classList.add('enrty-field_focus')
    }

    removeFocus() {
        this.$parent.classList.remove('enrty-field_focus')
    }

    setValue(value) {
        this.$field.value = value
        this.checkValidation()
    }
}


export class InputValidation extends InputComponent {
    constructor(config) {
        super(config)
        this.req = config.req
        this.classes = CONFIG_INPUTS
        this.validation = config.validationFunc
        this.isValid = false
        this.$fieldBlock = this.$field.closest('.field-block')
        this.init()
    }

    init() {
        if (this.$field.value.length && this.validation) this.checkValidation()
        this.$field.addEventListener('focus', () => {
            this.removeError()
            this.setFocus()
        })
        this.$field.addEventListener('blur', () => {
            this.removeFocus()
        })
        this.$field.addEventListener('input', () => {
            if (this.validation) this.checkValidation()
            if (this.initialValue === this.$field.value) {
                this.isChanged = false
            } else {
                this.isChanged = true
            }
            if (this.onChange) this.onChange(this.initialValue, this.$field.value)
        })
    }


    get value() {
        return this.$field.value
    }

    checkValidation() {
        const isVal = this.validation(this.$field.value)
        if (isVal) {
            this.removeError()
            this.setCorrect()
        } else {
            this.removeCorrect()
        }
    }

    showError(text) {
        this.$fieldBlock.querySelector('.field-block__undertext_error').innerHTML = text
    }

    hideError() {
        this.$fieldBlock.querySelector('.field-block__undertext_error').innerHTML = ''
    }

    showText(text) {
        this.$fieldBlock.querySelector('.field-block__undertext').innerHTML = text
    }

    setCorrect() {
        this.removeError()
        this.isValid = true
        this.$parent.classList.add(this.classes.classCorrect)
    }

    removeCorrect() {
        this.isValid = false
        this.$parent.classList.remove(this.classes.classCorrect)
    }

    setFocus() {
        this.$parent.classList.add(this.classes.classActive)
    }

    removeFocus() {
        this.$parent.classList.remove(this.classes.classActive)
    }

    setError() {
        this.removeCorrect()
        this.$parent.classList.add(this.classes.classError)
        this.removeReq()
    }

    removeError() {
        this.$parent.classList.remove(this.classes.classError)
    }

    removeReq() {
        this.$parent.classList.remove(this.classes.classReq)
    }

    setReq() {
        this.$parent.classList.add(this.classes.classReq)
        this.removeError()
    }
}

export class InputPass extends InputValidation {
    constructor(props) {
        props.req = true
        props.number = '.enrty-field__number-left'

        super(props)
        this.$countField = this.$parent.querySelector(props.number)
        this.callback = props.callBack || null
    }

    init() {
        super.init()
        this.$field.addEventListener('input', () => {
            if (this.$field.value.length > 0) {
                this.setError()
            } else {
                this.setReq()
            }
            if (ValidationComponent.isValidPass(this.$field.value)) {
                this.removeError()
                if (!this.callback) this.setCorrect()
            }
            this.$countField.innerHTML = this.$field.value.length
            if (this.callback) this.callback()
        })
    }
}

export class InputTel extends InputValidation {
    constructor(config = {}) {
        config.selector = '[data-tel]'
        config.req = true
        config.validationFunc = ValidationComponent.isValidTel
        super(config)
    }

    init() {
        IMask(this.$field, {
            mask: '+{7} (000) 000-00-00',
            lazy: false,
            placeholderChar: '_'
        })
        super.init()
    }
}

export class InputName extends InputValidation {
    constructor(config = {}) {
        config.selector = '[data-name]'
        config.req = true
        config.validationFunc = ValidationComponent.isValidName
        super(config)
    }
}


export class InputLastName extends InputValidation {
    constructor(config = {}) {
        config.selector = '[data-lastname]'
        config.req = false
        super(config)
    }
}

export class InputEmail extends InputValidation {
    constructor(config = {}) {
        config.selector = '[data-email]'
        config.req = true
        config.validationFunc = ValidationComponent.isValidEmail
        super(config)
    }
}

export class InputText extends InputValidation {
    constructor(config = {}) {
        config.selector = '[data-text]'
        config.req = true
        config.validationFunc = ValidationComponent.isEnoughText
        super(config)
    }
}

export class InputVin extends InputValidation {
    constructor(config = {}) {
        config.selector = '[data-vin]'
        config.req = true
        config.validationFunc = ValidationComponent.isValidVin
        super(config)
    }
}

export class InputPart extends InputValidation {
    constructor(config = {}) {
        config.selector = '[data-part]'
        config.req = true
        config.validationFunc = ValidationComponent.isValidPart
        super(config)
    }
}