import FormComponent from '../../../core/components/form.component.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'

class SelectionForm extends FormComponent {
    constructor(config) {
        super(config)
        this.method = config.method
        this.title = config.title
        this.data = config.data
        this.editor = config.editor
        this.onsuccess = config.onsuccess || new Function()
    }

    init() {
        this.$form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.validationForm(e, this.requestTo.bind(this))
        })
    }

    async requestTo() {
        const body = {
            answer: this.editor.getHTML()
        }

        new FormData(this.$form).forEach((value, key) => {
            body[key] = value
        })

        console.log(body)

        this.submitComponent.setPreloaderState()
        const res = await this.apiService.useRequest(this.router.selectionLink, {
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

export default SelectionForm