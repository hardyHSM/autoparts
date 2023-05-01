import {
    InputTel,
    InputName,
    InputLastName,
    InputEmail
} from '../../core/components/input.component.js'
import FormComponent from '../../core/components/form.component.js'
import ModalComponent from '../../core/components/modal.component.js'

class PersonalForm extends FormComponent {
    constructor(config) {
        super(config)
    }

    init() {
        this.fieldName = new InputName()
        this.fieldLastName = new InputLastName()
        this.fieldEmail = new InputEmail()
        this.fieldTel = new InputTel()

        this.fieldsList = [this.fieldName, this.fieldLastName, this.fieldEmail, this.fieldTel]
        this.$form.addEventListener('submit', (e) => {
            e.preventDefault()
            let isChanged = false
            this.fieldsList.forEach(item => {
                if (item.isChanged) isChanged = true
            })
            if (isChanged) {
                this.validationForm(e, this.requestToRegistration.bind(this))
            } else {
                new ModalComponent({
                    template: 'default',
                    title: 'Изменение профиля',
                    text: 'Вы ничего не поменяли!'
                }).create()
            }
        })
    }

    async requestToRegistration() {
        const body = {}
        new FormData(this.$form).forEach((value, key) => {
            body[key] = value
        })
        this.submitComponent.setPreloaderState()

        const res = await this.apiService.useRequestStatus(this.router.changeProfileLink, {
            method: 'PATCH',
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
                    title: 'Изменение профиля',
                    text: 'Данные аккаунты успешно изменены!',
                    closeHandler: () => {
                        this.router.reload()
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
                new ModalComponent({
                    template: 'default',
                    title: 'Изменение профиля',
                    text: 'Что-то пошло не так!',
                }).create()
                break
            }
        }
    }

}

export default PersonalForm

