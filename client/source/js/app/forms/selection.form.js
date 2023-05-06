import SelectComponent from '../../core/components/selects.inputs/select.component.js'
import NumberSelectComponent from '../../core/components/selects.inputs/number.select.component.js'
import FormComponent from '../../core/components/form.component.js'
import { InputEmail, InputName, InputPart, InputVin } from '../../core/components/selects.inputs/input.component.js'
import ModalComponent from '../../core/components/modals/modal.component.js'

class SelectionForm extends FormComponent {
    constructor(config) {
        super(config)
        this.auth = config.auth
    }

    init() {
        this.partSelect = new SelectComponent({
            query: '#part-select',
            data: [
                {
                    value: 'Оригинал',
                    dataset: 'original',
                    default: true
                },
                {
                    value: 'Заменитель',
                    dataset: 'substitute',
                    default: false
                },
                {
                    value: 'Любой',
                    dataset: 'any'
                }
            ],
            onselect: (data) => {

            }
        })
        this.partSelect.render()
        this.numberSelect = new NumberSelectComponent({ query: '#part-count-select' })
        this.numberSelect.init()

        this.fieldVin = new InputVin()
        this.fieldName = new InputName()
        this.fieldName.setValue(this.auth?.userData?.firstName || '')
        this.fieldEmail = new InputEmail()
        this.fieldEmail.setValue(this.auth?.userData?.email || '')
        this.fieldPart = new InputPart()
        this.fieldsList = [this.fieldName, this.fieldEmail, this.fieldPart, this.fieldVin]
        this.$form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.validationForm(e, this.requestToSelection.bind(this))
        })
    }

    async requestToSelection() {
        const body = {}
        new FormData(this.$form).forEach((value, key) => {
            body[key] = value
        })
        body.partType = this.partSelect.getValue()
        body.count = this.numberSelect.getValue()
        this.submitComponent.setPreloaderState()

        const data = await this.apiService.useRequest(this.router.selectionLink, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        new ModalComponent({
            template: 'default',
            title: 'Подбор запчасти',
            text: data.message,
            closeHandler: () => {
                this.fieldsList.forEach(input => {
                    input.clear()
                    input.removeCorrect()
                })
                this.submitComponent.setTextState()
            }
        }).create()
    }
}

export default SelectionForm


