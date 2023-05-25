import ModalComponent from '../../core/components/modals/modal.component.js'
import ValidationComponent from '../../core/components/validation.component.js'
import ButtonComponent from '../../core/components/button.component.js'
import { template, states } from '../configs/login.modal.config.js'
import { html } from 'code-tag'

class ModalLogin extends ModalComponent {
    constructor(config) {
        super(config)
        this.router = config.router
        this.states = config.states
        this.containerSelector = config.container
        this.template = template
        this.states = states
        this.container = null
        this.currentState = null
        this.validateBool = true

    }

    create() {
        super.create()
        this.$container = document.querySelector(this.containerSelector)
        this.changeToEmail()
        this.registerHandlers()
    }

    registerHandlers() {
        this.$modal.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'a') return
            e.preventDefault()
            if (e.target.hasAttribute('data-login-submit')) this.clickSubmit()
            if (e.target.hasAttribute('data-switch-email')) this.changeToEmail()
            if (e.target.hasAttribute('data-forget-pass')) this.forgetPassword()
            if (e.target.hasAttribute('data-remember-pass')) this.changeToEmail()
        })
    }

    clickSubmit() {
        if (this.currentState !== 'forgetPass') {
            this.validation()
        } else {
            this.validationRecovery()
        }
    }

    renderState(state) {
        for ( const [key, value] of Object.entries(this.states) ) {
            if (value === state) this.currentState = key
        }

        this.$container.innerHTML = state
        document.querySelector('.page-popup__button').focus()
    }

    changeToEmail() {
        this.renderState(this.states.loginEmail)
        this.submit = new ButtonComponent('[data-login-submit]')
        this.$email_input = this.$modal.querySelector('[data-email]')
        this.$errors = this.$modal.querySelector('[data-errors]')
        this.$pass_input = this.$modal.querySelector('[data-pass]')
    }

    forgetPassword() {
        this.renderState(this.states.forgetPass)
        this.submit = new ButtonComponent('[data-login-submit]')
        this.$email_input = this.$modal.querySelector('[data-email]')
        this.$errors = this.$modal.querySelector('[data-errors]')
    }

    stateMailWasSent() {
        this.renderState(this.states.sendRecoveryMail)
        document.querySelector('[data-info] b').innerHTML = this.$email_input.value
    }

    async validation() {
        this.validateBool = true
        this.clearErrors()
        if (!ValidationComponent.isValidEmail(this.$email_input.value)) {
            this.renderError('Некорректный ввод почты. Повторите попытку.')
            this.validateBool = false
        }
        if (!ValidationComponent.isValidPass(this.$pass_input.value)) {
            this.validateBool = false
            this.renderError('Некорректный ввод пароля. Пароль должен иметь как минимум 6 символов.')
        }

        if (this.validateBool) {
            const user = {
                email: this.$email_input.value,
                password: this.$pass_input.value
            }
            this.submit.setPreloaderState('white')
            const res = await fetch(this.router.loginLink, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            const data = await res.json()
            if (data.message) {
                this.submit.setTextState()
                this.renderError(data.message)
            } else {
                this.router.redirectMain()
            }
        }
    }

    clearErrors() {
        this.$errors.innerHTML = ''
    }

    renderError(text) {
        this.$errors.innerHTML += `
            <div class="page-popup__error message message_error">
                ${text}
            </div>`
    }

    async validationRecovery() {
        this.clearErrors()
        if (!ValidationComponent.isValidEmail(this.$email_input.value)) {
            return this.renderError('Некорректный ввод почты. Повторите попытку.')
        }
        this.submit.setPreloaderState('white')
        const email = this.$email_input.value
        let status = null
        const res = await fetch(this.router.passRecoveryLink, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        status = res.status
        const data = await res.json()
        this.submit.setTextState()
        if (status === 400) {
            this.renderError(data.message)
        } else {
            this.stateMailWasSent()
        }
    }

}


export default ModalLogin

