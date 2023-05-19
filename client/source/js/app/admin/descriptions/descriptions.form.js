import FormComponent from '../../../core/components/form.component.js'
import { InputValidation } from '../../../core/components/selectsinputs/input.component.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'

class DescriptionsForm extends FormComponent {
    constructor(config) {
        super(config)
        this.method = config.method
        this.title = config.title
        this.onsuccess = config.onsuccess
        this.editor = config.editor
    }
    init() {
        this.titleInput = new InputValidation({
            selector: '[data-title]',
            req: true
        })

        this.fieldsList = [this.titleInput]

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
        body.description = this.editor.getMarkdown()
        const res = await this.apiService.useRequest(this.router.productsDescriptionsLink, {
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

export default DescriptionsForm