import FormComponent from '../../core/components/form.component.js'
import { InputPass } from '../../core/components/selects/input.component.js'
import ModalComponent from '../../core/components/modal.component.js'

class RecoveryForm extends FormComponent {
    constructor(config) {
        super(config)
        this.router = config.router
        this.link = config.link
    }

    init() {
        this.fieldPass = new InputPass({
            selector: '[data-pass]',
            callBack: () => {
                this.checkPasswordsEqual.call(this, this.fieldPass, this.fieldRepass)
            }
        })
        this.fieldRepass = new InputPass({
            selector: '[data-repass]',
            callBack: () => {
                this.checkPasswordsEqual.call(this, this.fieldPass, this.fieldRepass)
            }
        })
        this.fieldsList = [this.fieldPass, this.fieldRepass]

        this.$form.addEventListener('submit', (e) => {
            this.validationForm(e, this.requestToRecoveryPassword.bind(this))
        })
    }

    async requestToRecoveryPassword() {
        this.submitComponent.setPreloaderState()
        const res = await this.apiService.useRequestStatus(this.router.recoveryPasswordLink, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: this.fieldPass.$field.value,
                repassword: this.fieldRepass.$field.value,
                link: this.link
            })
        })
        this.submitComponent.setTextState()
        this.submitComponent.toggleDisabled()
        if (res.status === 200) {
            new ModalComponent({
                template: 'default',
                title: 'Смена Пароля',
                text: 'Ваш пароль успешно изменён!',
                closeHandler: () => {
                    this.router.redirectMain()
                }
            }).create()
        }
    }

}

export default RecoveryForm