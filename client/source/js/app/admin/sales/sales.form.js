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


class SalesForm extends FormComponent {
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
        this.tel = new InputTel()
        this.email = new InputEmail()


        this.fieldsList = [this.name, this.tel, this.email]

        this.$form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.validationForm(e, this.requestTo.bind(this))
        })
    }

    registerSelects() {
        this.selectStatus = new SelectComponent({
            query: '[data-select-status]',
            key: 'status',
            data: [
                {
                    value: 'Отменён',
                    dataset: 'Отменён'
                },
                {
                    value: 'Сделка завершена',
                    dataset: 'Сделка завершена'
                },
                {
                    value: 'В процессе',
                    dataset: 'В процессе'
                },
                {
                    value: 'В обработке',
                    dataset: 'В обработке',
                    default: true
                }
            ]
        })
        this.selectStatus.setDefault(this.data.status)
        this.selectPromo = new SelectComponent({
            key: 'promo',
            query: '[data-select-promo]',
            data: configData
        })
        this.selectPromo.setDefault(this.data.promo)
        this.selectDelivery = new SelectComponent({
            key: 'delivery',
            query: '[data-select-delivery]',
            data: configData
        })
        this.selectDelivery.setDefault(this.data.delivery)
        this.selectPayment = new SelectComponent({
            key: 'payment',
            query: '[data-select-payment]',
            data: [
                {
                    value: 'При получении',
                    dataset: 'getting',
                    default: true
                },
                {
                    value: 'Звонок оператору',
                    dataset: 'call'
                }
            ]
        })
        this.selectPayment.setDefault(this.data.payment)


        this.selectsList = [this.selectStatus, this.selectPromo, this.selectDelivery, this.selectPayment]
        this.selectsList.forEach(select => select.render())
    }

    async requestTo() {
        const body = {}
        new FormData(this.$form).forEach((value, key) => {
            body[key] = value
        })
        this.selectsList.forEach(select => {
            console.log(select)
            body[select.key] = select.getValue()
        })

        this.submitComponent.setPreloaderState()
        const res = await this.apiService.useRequest(this.router.orderLink, {
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

export default SalesForm