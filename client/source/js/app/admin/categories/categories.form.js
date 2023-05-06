import FormComponent from '../../../core/components/form.component.js'
import ValidationComponent from '../../../core/components/validation.component.js'
import { InputValidation } from '../../../core/components/selects.inputs/input.component.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'

class CategoryForm extends FormComponent {
    constructor(config) {
        super(config)
        this.method = config.method
        this.title = config.title
        this.onsuccess = config.onsuccess
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
        const res = await this.apiService.useRequest(this.router.categoriesLink, {
            method: this.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        this.submitComponent.setTextState()
        if(res.success) {
            new ModalComponent({
                template: 'default',
                title: this.title,
                text: res.success
            }).create()
            if(this.onsuccess) this.onsuccess()
        } else {
            new ModalComponent({
                template: 'default',
                title: this.title,
                text: `Что-то пошло не так! ${res.message}`
            }).create()
        }
    }
}

export default CategoryForm