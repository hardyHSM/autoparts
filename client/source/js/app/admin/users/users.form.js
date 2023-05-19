import FormComponent from '../../../core/components/form.component.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'
import SelectComponent from '../../../core/components/selectsinputs/select.component.js'
import {
    InputEmail,
    InputLastName,
    InputName,
    InputTel,
    InputValidation
} from '../../../core/components/selectsinputs/input.component.js'

const configData = [
    {
        value: 'Да',
        dataset: 'true',
        default: true
    },
    {
        value: 'Нет',
        dataset: 'false'
    }
]


class UsersForm extends FormComponent {
    constructor(config) {
        super(config)
        this.method = config.method
        this.title = config.title
        this.data = config.data
        this.onsuccess = config.onsuccess || new Function()
    }

    init() {
        this.registerSelects()
        this.name = new InputName()
        this.lastName = new InputLastName()
        this.tel = new InputTel()
        this.email = new InputEmail()


        this.fieldsList = [this.name, this.lastName, this.tel, this.email]

        this.$form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.validationForm(e, this.requestTo.bind(this))
        })
    }

    registerSelects() {
        this.selectRole = new SelectComponent({
            query: '[data-select-role]',
            key: 'role',
            data: [
                {
                    value: 'Администратор',
                    dataset: 'ADMIN'
                },
                {
                    value: 'Пользователь',
                    dataset: 'USER'
                },
            ]
        })
        this.selectActivation = new SelectComponent({
            query: '[data-select-activation]',
            key: 'activation',
            data: configData
        })
        this.selectActivation.setDefault(this.data.isActivated.toString())
        this.selectRole.setDefault(this.data.role)

        this.selectsList = [this.selectRole, this.selectActivation]
        this.selectsList.forEach(select => select.render())
    }

    async requestTo() {
        const body = {}
        new FormData(this.$form).forEach((value, key) => {
            body[key] = value
        })
        this.selectsList.forEach(select => {
            body[select.key] = select.getValue()
        })
        body['location'] = document.querySelector('[data-address]').dataset.address


        console.log(body)

        this.submitComponent.setPreloaderState()
        const res = await this.apiService.useRequest(this.router.usersLink, {
            method: this.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        this.submitComponent.setTextState()

        if (res.success) {
            new ModalComponent({
                template: 'default',
                title: this.title,
                text: `${res.success}`
            }).create()
            this.onsuccess()
        } else {
            new ModalComponent({
                template: 'default',
                title: this.title,
                text: `Что-то пошло не так! ${res.message}`
            }).create()
        }
    }
}

export default UsersForm