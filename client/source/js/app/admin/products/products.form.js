import FormComponent from '../../../core/components/form.component.js'
import ValidationComponent from '../../../core/components/validation.component.js'
import { InputValidation } from '../../../core/components/selects/input.component.js'
import ModalComponent from '../../../core/components/modal.component.js'
import SelectInputComponent from '../../../core/components/selects/select.input.component.js'
import InputFileComponent from '../../../core/components/selects/input.file.component.js'
import InputCompleteComponent from '../../../core/components/selects/input.complete.component.js'

class ProductsForm extends FormComponent {
    constructor(config) {
        super(config)
        this.method = config.method
        this.title = config.title
        this.data = config.data
        this.onsuccess = config.onsuccess
    }

    init() {
        this.registerSelects()

        this.fileInput = new InputFileComponent({
            root: '[data-image-input]'
        })
        this.fileInput.init()
        this.name = new InputValidation({
            selector: '[data-name]',
            req: true
        })
        this.maker = new InputValidation({
            selector: '[data-maker]',
            req: true
        })
        this.count = new InputValidation({
            selector: '[data-count]',
            req: true,
            validationFunc: ValidationComponent.isValidNumber
        })
        this.price = new InputValidation({
            selector: '[data-price]',
            req: true,
            validationFunc: ValidationComponent.isValidNumber
        })
        this.popularity = new InputValidation({
            selector: '[data-popularity]',
            req: true,
            validationFunc: ValidationComponent.isValidNumber
        })

        this.provider = new InputCompleteComponent({
            selector: '[data-provider]',
            req: true,
            data: this.data.providers
        })

        this.stock = new InputCompleteComponent({
            selector: '[data-stock]',
            req: true,
            data: this.data.stocks
        })

        this.fieldsList = [this.name, this.maker, this.count, this.price, this.popularity, this.provider, this.stock]
        this.selectsList = [this.selectCategories, this.selectSubcategories, this.selectDescriptions]
        this.$form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.validationForm(e, this.requestTo.bind(this))
        })
    }

    registerSelects() {
        this.selectCategories = new SelectInputComponent({
            title: 'Выбор категории',
            key: 'categoryId',
            query: '[data-category-select]',
            data: this.data.categories
        })
        this.selectSubcategories = new SelectInputComponent({
            title: 'Выбор подкатегории',
            key: 'subcategoryId',
            query: '[data-subcategory-select]',
            data: this.data.subcategories
        })
        this.selectDescriptions = new SelectInputComponent({
            title: 'Выбор описания',
            key: 'descriptionId',
            query: '[data-description-select]',
            data: this.data.descriptions
        })

        this.selectCategories.setTitle(this.data?.product?.category?.name)
        this.selectDescriptions.setTitle(this.data?.product?.info?.title)
        this.selectCategories.render()
        this.selectDescriptions.render()

        this.selectHandler(this.selectCategories.getValue())
        this.selectCategories.onselect = ({ value }) => {
            this.selectHandler(value)
        }
        this.selectSubcategories.setTitle(this.data?.product?.subcategory?.name)
        this.selectSubcategories.render()
    }

    selectHandler(value) {
        if (!value) {
            this.selectSubcategories.disable()
        } else {
            this.selectSubcategories.data = this.data.subcategories.filter(s => s.category === value)
            this.selectSubcategories.setTitle('')
            this.selectSubcategories.enable()
        }
    }

    async requestTo() {
        this.submitComponent.setPreloaderState()
        const body = {}
        new FormData(this.$form).forEach((value, key) => {
            if (key === 'attributes') {
                body[key] = JSON.parse(value)
            } else {
                body[key] = value
            }
        })
        this.selectsList.forEach(select => {
            if (!select.getValue()) {
                return select.showError(`Выберите данное поле!`)
            } else {
                body[select.key] = select.getValue()
            }
        })
        if (this.fileInput.file) {
            body['image'] = this.fileInput.file
        }

        const res = await this.apiService.useRequest(this.router.productsLink, {
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
                text: res.success
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

export default ProductsForm