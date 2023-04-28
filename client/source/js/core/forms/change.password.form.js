import FormComponent from '../components/form.component.js'
import { InputPass } from '../components/input.component.js'
import ModalComponent from '../components/modal.component.js'
import ValidationComponent from '../components/validation.component.js'

class ChangePasswordForm extends FormComponent {
    constructor(config) {
        super(config)
        this.auth = config.auth
        this.link = config.link
    }

    init() {
        this.fieldOldPass = new InputPass({
            selector: '[data-old-pass]',
            validationFunc: ValidationComponent.isValidPass
        })
        this.fieldNewPass = new InputPass({
            selector: '[data-new-pass]',
            validationFunc: ValidationComponent.isValidPass
        })
        this.fieldsList = [this.fieldOldPass, this.fieldNewPass]

        this.$form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.validationForm(e, this.requestToChangePassword.bind(this))
        })
    }

    async requestToChangePassword() {
        this.submitComponent.setPreloaderState()
        const res = await this.apiService.useRequestStatus(this.router.changePasswordLink, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prevPassword: this.fieldOldPass.$field.value,
                newPassword: this.fieldNewPass.$field.value
            })
        })
        this.submitComponent.setTextState()
        this.fieldOldPass.clear()
        this.fieldNewPass.clear()
        if (res.status === 200) {
            new ModalComponent({
                template: 'default',
                title: 'Смена Пароля',
                text: 'Ваш пароль успешно изменён!',
                closeHandler: () => {
                    this.router.reload()
                }
            }).create()
        } else if (res.status === 403) {
            this.recoveryPassword(res.data.message)
        } else {
            this.fieldOldPass.showError(res.data.message)
        }
    }
    recoveryPassword(message) {
        this.fieldOldPass.showText('Если вы не помните пароль, мы отправим вам на почту сообщение с его восстановлением - <button class="field-block__button" data-recovery-password>Отправить</button>')
        this.fieldOldPass.showError(message)
        document.querySelector('[data-recovery-password]').addEventListener('click', async () => {
            const res = await this.apiService.useRequestStatus(this.router.passRecoveryLink, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: this.auth.userData.email })
            })
            new ModalComponent({
                template: 'default',
                title: 'Восстановление пароля',
                text: res.data.message
            }).create()
        })
    }
}

export default ChangePasswordForm