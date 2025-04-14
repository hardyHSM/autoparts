import FormComponent from '../../../core/components/form.component.js'
import ValidationComponent from '../../../core/components/validation.component.js'
import { InputValidation } from '../../../core/components/selectsinputs/input.component.js'
import SelectInputComponent from '../../../core/components/selectsinputs/select.input.component.js'
import InputFileComponent from '../../../core/components/selectsinputs/input.file.component.js'
import InputCompleteComponent from '../../../core/components/selectsinputs/input.complete.component.js'
import scrollToTop, { decodeString } from '../../utils/utils.js'
import descriptionsModel, { descriptionsConfig } from '../descriptions/descriptions.model.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'
import { router } from '../../common.modules.js'
import DescriptionsModel from '../descriptions/descriptions.model.js'


class ProductsForm extends FormComponent {
    constructor(config) {
        super(config)
        this.attributesEditor = config.attributesEditor
        this.hasImage = config.hasImage || false
        this.onSubmit = config.onSubmit || new Function()
    }

    async init() {
        this.registerSelects()
        this.fileInput = new InputFileComponent({
            root: '[data-image-input]'
        })
        this.fileInput.init()
        if (this.hasImage) {
            const data = await this.fileInput.imageToBase64(this.hasImage)
            this.fileInput.file = data
        }

        this.name = new InputValidation({
            selector: '[data-name]',
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

        this.maker = new InputCompleteComponent({
            selector: '[data-maker]',
            req: true,
            data: this.data.makers
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


        await this.attributesEditor.init()

        this.fieldsList = [this.name, this.maker, this.count, this.price, this.popularity, this.provider, this.stock]
        this.selectsList = [this.selectCategories, this.selectSubcategories, this.selectDescriptions]

        this.$form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.validationForm(e, this.requestTo.bind(this))
        })
        this.$form.addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                e.preventDefault()
            }
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
            req: false,
            link: '/admin/content/products_description/edit?id=',
            data: [],
            dynamicData: {
                state: true,
                func: async (value) => {
                    const data = await descriptionsModel.search(value)
                    return data.list.map(p => {
                        return { value: p.title, dataset: p._id }
                    })
                }
            }
        })

        this.selectCategories.setTitle(this.data?.product?.category?.name)
        this.selectCategories.render()
        this.selectDescriptions.setTitle(this.data?.product?.info?.title)
        this.selectDescriptions.render()

        this.selectHandler(this.selectCategories.getValue())
        this.selectCategories.onselect = ({ value }) => {
            this.selectHandler(value)
        }
        this.selectSubcategories.setTitle(this.data?.product?.subcategory?.name)
        this.selectSubcategories.render()
    }

    selectHandler(value) {
        this.selectSubcategories.setTitle('')
        if (!value) {
            this.selectSubcategories.disable()
        } else {
            this.selectSubcategories.enable()
            this.selectSubcategories.setData(this.data.subcategories.filter(s => s.category === value))
            this.selectSubcategories.render()
        }
    }

    async requestTo() {
        let error = false
        const body = {}
        new FormData(this.$form).forEach((value, key) => {
            body[key] = value
        })

        const attributes = this.attributesEditor.serializeData()

        if(!attributes) {
            error = true
            new ModalComponent({
                template: 'default',
                title: 'Ошибка',
                text: 'Заполните корректно форму аттрибутов и повторите попытку. '
            }).create()
        } else {
            body.attributes = attributes
        }

        this.selectsList.forEach(select => {
            if (select.req && !select.getValue()) {
                scrollToTop(select.$header)
                select.showError(`Выберите данное поле!`)
                error = true
            } else {
                body[select.key] = select.getValue()
            }
        })
        if (error) return

        body['image'] = this.fileInput.file


        this.submitComponent.setPreloaderState()
        const res = await this.apiService.useRequestStatus(this.router.productsLink, {
            method: this.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        this.submitComponent.setTextState()
        if (res.status === 200) {
            new ModalComponent({
                template: 'default',
                title: this.title,
                text: `${res.data.message} Товар можно посмотреть здесь - <a class="page-link" href="/products/${res.data.product._id}">*тык*</a>`
            }).create()
            this.onSubmit()
        } else {
            new ModalComponent({
                template: 'default',
                title: this.title,
                text: res.data.message
            }).create()
        }
    }
}

export class ProductFilterForm extends FormComponent {
    constructor(config) {
        super(config)
    }

    async init() {
        const data = this.data
        this.selectCategories = new SelectInputComponent({
            title: 'Выбор категории',
            key: 'category',
            query: '[data-category-select]',
            data: this.data.categories
        })
        this.selectSubcategories = new SelectInputComponent({
            title: 'Выбор подкатегории',
            key: 'subcategory',
            query: '[data-subcategory-select]',
            data: this.data.subcategories
        })


        this.selectCategories.onselect = ({ value }, target) => {
            this.selectSubcategories.setTitle('')
            if (!value) {
                this.selectSubcategories.disable()
            } else {
                this.selectSubcategories.enable()
                this.selectSubcategories.setData(data.subcategories.filter(s => s.category === value))
                this.selectSubcategories.render()
            }
        }

        this.selectDescriptions = new SelectInputComponent({
            title: 'Выбор описания',
            key: 'info',
            query: '[data-description-select]',
            data: [],
            dynamicData: {
                state: true,
                func: async (value) => {
                    const data = await descriptionsModel.search(value)
                    return data.list.map(p => {
                        return { value: p.title, dataset: p._id }
                    })
                }
            }
        })

        await this.initRoutes(data)
        this.selectCategories.render()
        this.selectSubcategories.render()
        this.selectDescriptions.render()

        this.selectsList = [this.selectSubcategories, this.selectCategories, this.selectDescriptions]

        this.$form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.requestTo()
        })
    }

    async initRoutes(data) {
        const category = data.categories.find(category => category.dataset === this.router.getParam(this.selectCategories.key))
        const subcategory = data.subcategories.find(subcategory => subcategory.dataset === this.router.getParam(this.selectSubcategories.key))
        if (category) {
            this.selectCategories.setTitle(decodeString(category.value))
            this.selectCategories.onselect({
                value: decodeString(category.dataset)
            })
        }
        if (this.selectCategories.isSelected) {
            this.selectSubcategories.setTitle(decodeString(subcategory?.value || ''))
        } else {
            this.selectSubcategories.disable()
        }
        const descriptionId = this.router.getParam(this.selectDescriptions.key)
        if (descriptionId) {
            const description = await DescriptionsModel.getId(descriptionId)
            if (description.title) {
                this.selectDescriptions.setTitle(decodeString(description.title))
            }
        }
    }

    async requestTo() {
        this.selectsList.forEach(select => {
            const value = select.getValue() || ''
            this.router.addParams(select.key, value)
        })
        this.router.redirectUrlState()
        this.onSubmit()
    }
}


export default ProductsForm