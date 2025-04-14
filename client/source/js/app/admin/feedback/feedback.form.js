import FormComponent from '../../../core/components/form.component.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'

class FeedbackForm extends FormComponent {
    constructor(config) {
        super(config)
        this.editor = config.editor
    }

    init() {
        this.$form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.validationForm(e, this.requestTo.bind(this))
        })
    }

    async requestTo() {
        const body = {
            answer: tinymce.get('editor').getContent({format: 'raw'})
        }

        new FormData(this.$form).forEach((value, key) => {
            body[key] = value
        })


        this.submitComponent.setPreloaderState()
        const res = await this.apiService.useRequestStatus(this.router.feedBackLink, {
            method: this.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        this.submitComponent.setTextState()

        new ModalComponent({
            template: 'default',
            title: this.title,
            text: res.data.message
        }).create()

        if (res.status === 200) {
            if (this.onSubmit) this.onSubmit()
        }
    }
}

export default FeedbackForm