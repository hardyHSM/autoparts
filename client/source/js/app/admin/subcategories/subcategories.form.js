import FormComponent from '../../../core/components/form.component.js'
import ValidationComponent from '../../../core/components/validation.component.js'
import { InputValidation } from '../../../core/components/selects/input.component.js'
import ModalComponent from '../../../core/components/modal.component.js'

class SubcategoryForm extends FormComponent {
    constructor(config) {
        super(config)
        this.method = config.method
        this.title = config.title
        this.select = config.select
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


        this.fieldsList = [this.name, this.link]



        this.$form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.validationForm(e, this.requestTo.bind(this))
        })
    }

    async requestTo() {
        const body = {}
        new FormData(this.$form).forEach((value, key) => {
            body[key] = value
        })

        if(!this.select.getValue()) {
            return this.select.showError('Выберите категорию!')
        } else {
            body[this.select.key] = this.select.getValue()
        }
        this.submitComponent.setPreloaderState()
        const res = await this.apiService.useRequest(this.router.subcategoriesLink, {
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
            this?.onsuccess?.()
        } else {
            new ModalComponent({
                template: 'default',
                title: this.title,
                text: `Что-то пошло не так! ${res.message}`
            }).create()
        }
    }
}

export default SubcategoryForm