import FormComponent from '../../core/components/form.component.js'
import { InputEmail, InputLastName, InputName, InputTel } from '../../core/components/selectsinputs/input.component.js'
import { renderOrderFirstStage, renderOrderSecondStage, renderOrderSuccess } from '../views/render.order.js'
import ButtonComponent from '../../core/components/button.component.js'
import ModalComponent from '../../core/components/modals/modal.component.js'
import scrollToTop, { getTotalPriceWithPromo } from '../utils/utils.js'
import { pickLocationChange } from '../service/pick.location.js'

class OrderForm extends FormComponent {
    constructor(config) {
        super(config)
        this.auth = config.auth
        this.userNav = config.userNav
        this.orderData = config.orderData
        this.locationModule = config.locationModule
    }

    async renderFirstStage() {
        this.body = {}
        this.$form.innerHTML = renderOrderFirstStage(this.auth)
        this.$nextStageButton = document.querySelector('[data-next-stage]')
        this.fieldName = new InputName()
        this.fieldLastName = new InputLastName()
        this.fieldEmail = new InputEmail()
        this.fieldTel = new InputTel()


        this.fieldsList = [this.fieldName, this.fieldLastName, this.fieldEmail, this.fieldTel]

        this.$nextStageButton.addEventListener('click', (e) => {
            this.validationForm(e, this.renderSecondStage.bind(this))
        })
        pickLocationChange((name) => {
            document.querySelector('[data-address]').innerHTML = name
        })
    }

    async renderSecondStage() {
        new FormData(this.$form).forEach((value, key) => {
            this.body[key] = value
        })
        this.body.location = document.querySelector('[data-address]').textContent
        this.$form.innerHTML = renderOrderSecondStage()
        document.querySelector('[data-checkout]').addEventListener('click', (e) => {
            new FormData(this.$form).forEach((value, key) => {
                this.body[key] = value
            })
            e.preventDefault()
            this.requestToOrder()
        })
        document.querySelector('[data-back]').addEventListener('click', () => {
            this.renderFirstStage()
        })
    }

    async requestToOrder() {
        const button = new ButtonComponent('[data-checkout]')
        button.setPreloaderState()

        const res = await this.apiService.useRequestStatus(this.router.orderLink, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...this.body,
                ...this.orderData,
                total: this.orderData.promo ? getTotalPriceWithPromo(this.orderData.products, 330): getTotalPriceWithPromo(this.orderData.products, 0)
            })
        })
        if (res.status !== 200) {
            new ModalComponent({
                template: 'default',
                title: 'Оформление заказа',
                text: 'Что-то пошло не так, повторите попозже!'
            }).create()
        } else {
            sessionStorage.removeItem('order')
            this.$form.innerHTML = renderOrderSuccess()
            this.userNav.changeState()
        }
    }
}


export default OrderForm