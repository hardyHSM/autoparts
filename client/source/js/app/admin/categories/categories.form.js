import FormComponent from '../../../core/components/form.component.js'
import ValidationComponent from '../../../core/components/validation.component.js'
import { InputValidation } from '../../../core/components/selectsinputs/input.component.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'

class CategoryForm extends FormComponent {
    constructor(config) {
        super(config)
    }
    init() {
        this.name = new InputValidation({
            selector: '[data-name]',
            req: true,
            validationFunc: ValidationComponent.isValidCategory
        })

        this.link = new InputValidation({
            selector: '[data-link-field]',
            req: true,
            validationFunc: ValidationComponent.isValidLink
        })


        this.number = new InputValidation({
            selector: '[data-order]',
            req: true,
            validationFunc: ValidationComponent.isValidNumber
        })

        this.fieldsList = [this.name, this.link, this.number]
        this.$form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.validationForm(e, this.requestTo.bind(this))
        })
    }

    async requestTo() {
        this.submitComponent.setPreloaderState()
        const body = {}
        new FormData(this.$form).forEach((value, key) => {
            body[key] = value
        })
        const res = await this.apiService.useRequestStatus(this.router.categoriesLink, {
            method: this.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        new ModalComponent({
            template: 'default',
            title: this.title,
            text: res.data.message
        }).create()

        this.submitComponent.setTextState()
        if(res.status === 200) {
            if(this.onSubmit) this.onSubmit()
        }
    }
}

export default CategoryForm