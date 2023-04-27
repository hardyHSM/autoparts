import ValidationComponent from './validation.component.js'
import ButtonComponent from './button.component.js'

export default class FormComponent {
    constructor(config) {
        this.apiService = config.apiService
        this.preloader = config.preloader
        this.router = config.router
        this.form = document.querySelector(config.form)
        this.submitComponent = config.submitSelector ? new ButtonComponent(config.submitSelector) : null
        this.fieldsList = []
    }

    validationForm(e, callback) {
        e.preventDefault()
        let fullValidation = true
        this.fieldsList.forEach(input => {
            if (input.req && !input.isValid) {
                fullValidation = false
                input.setError()
            }
        })
        if (fullValidation) {
            callback()
        }
    }

    checkPasswordsEqual(fieldPass, fieldRepass) {
        const pass = fieldPass
        const repass = fieldRepass

        if (pass.field.value.length < 6) {
            repass.removeError()
            repass.removeCorrect()
            repass.showError('')
            return
        }

        if (ValidationComponent.isEqualPassword(pass.field.value, repass.field.value)) {
            pass.setCorrect()
            repass.setCorrect()
            repass.showError('')
        } else {
            repass.setError()
            repass.removeCorrect()
            pass.removeCorrect()
            repass.showError('Пароли не совпадают')
        }
    }
}

