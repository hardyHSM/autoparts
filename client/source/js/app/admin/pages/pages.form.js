import FormComponent from '../../../core/components/form.component.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'
import { InputValidation } from '../../../core/components/selectsinputs/input.component.js'
import ValidationComponent from '../../../core/components/validation.component.js'

class PagesForm extends FormComponent {
    constructor(config) {
        super(config)
        this.method = config.method
        this.title = config.title
        this.parseFields = config.parseFields
        this.onSubmit = config.onSubmit
    }

    init() {
        this.name = new InputValidation({
            selector: '[name="name"]',
            req: true,
            validationFunc: ValidationComponent.isOnlyRussianLetters
        })

        this.link = new InputValidation({
            selector: '[name="link"]',
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
        const body = this.parseFields(this.$form)
        this.submitComponent.setPreloaderState()
        const res = await this.apiService.useRequestStatus(this.router.pageParamsLink, {
            method: this.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        this.submitComponent.setTextState()
        if(res.status === 200) {
            new ModalComponent({
                template: 'default',
                title: this.title,
                text: res.data.message
            }).create()
            if(this.onSubmit) this.onSubmit()
        } else {
            new ModalComponent({
                template: 'default',
                title: 'Ошибка',
                text: res.data.message
            }).create()
        }
    }
}

export default PagesForm