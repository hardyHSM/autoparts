import {
    InputPass,
    InputTel,
    InputName,
    InputLastName,
    InputEmail
} from '../../core/components/selects/input.component.js'
import FormComponent from '../../core/components/form.component.js'
import ModalComponent from '../../core/components/modal.component.js'

class RegistrationForm extends FormComponent {
    constructor(config) {
        super(config)
    }

    init() {
        this.fieldName = new InputName()
        this.fieldLastName = new InputLastName()
        this.fieldEmail = new InputEmail()
        this.fieldTel = new InputTel()

        this.fieldPass = new InputPass({
            selector: '[data-pass]',
            callBack: () => this.checkPasswordsEqual.call(this, this.fieldPass, this.fieldRepass)
        })

        this.fieldRepass = new InputPass({
            selector: '[data-repass]',
            callBack: () => this.checkPasswordsEqual.call(this, this.fieldPass, this.fieldRepass)
        })

        this.fieldsList = [this.fieldName, this.fieldLastName, this.fieldEmail, this.fieldTel, this.fieldPass, this.fieldRepass]
        this.$form.addEventListener('submit', (e) => {
            this.validationForm(e, this.requestToRegistration.bind(this))
        })
    }

    async requestToRegistration() {
        const body = {}
        new FormData(this.$form).forEach((value, key) => {
            body[key] = value
        })
        this.submitComponent.setPreloaderState()
        const res = await this.apiService.useRequestStatus(this.router.regLink, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        switch (res.status) {
            case 200: {
                new ModalComponent({
                    template: 'default',
                    title: 'Регистрация',
                    text: `
                        <p>Вы успешно зарегистрировались!</p>
                        На почту <b>${res.data.email}</b> отправлено письмо, подтвердите, пожалуйста, свой аккаунт.</b>
                    `,
                    closeHandler: () => {
                        this.router.redirectMain()
                    }

                }).create()
                break
            }
            case 409: {
                this.submitComponent.setTextState()
                this.fieldEmail.showError('Такая почта уже существует!')
                this.fieldEmail.setError()
                break
            }
            default: {
                return
            }
        }
    }

}

export default RegistrationForm

