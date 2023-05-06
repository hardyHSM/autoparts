import FormComponent from '../../core/components/form.component.js'
import { InputEmail, InputName, InputText } from '../../core/components/selects.inputs/input.component.js'
import ModalComponent from '../../core/components/modals/modal.component.js'

class FeedbackForm extends FormComponent {
    constructor(config) {
        super(config)
        this.auth = config.auth
    }

    init() {
        this.fieldName = new InputName()
        this.fieldName.setValue(this.auth?.userData?.firstName || '')
        this.fieldEmail = new InputEmail()
        this.fieldEmail.setValue(this.auth?.userData?.email || '')
        this.fieldText = new InputText()
        this.fieldsList = [this.fieldName, this.fieldEmail, this.fieldText]

        this.$form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.validationForm(e, this.requestToFeedback.bind(this))
        })
    }

    async requestToFeedback() {
        const body = {}
        new FormData(this.$form).forEach((value, key) => {
            body[key] = value
        })

        this.submitComponent.setPreloaderState()
        const data = await this.apiService.useRequest(this.router.feedBackLink, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        this.submitComponent.setTextState()
        new ModalComponent({
            template: 'default',
            title: 'Напишите нам',
            text: data.message,
            closeHandler: () => {
                this.fieldsList.forEach(input => {
                    input.clear()
                    input.removeCorrect()
                })
            }
        }).create()
    }
}


export default FeedbackForm