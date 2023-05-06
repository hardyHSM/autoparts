import { html } from 'code-tag'
import ModalComponent from './modal.component.js'
import SelectInputComponent from '../selects.inputs/select.input.component.js'
import productsModel from '../../../app/admin/products/products.model.js'

export default class ModalCopyComponent extends ModalComponent {
    constructor(config) {
        super(config)
        this.$modal.classList.add('page-popup_wide')
        this.onSelect = config.onSelect
    }

    async create() {
        this.template = html`
            <button class="page-popup__close" data-close></button>
            <div class="page-popup__container">
                <h2 class="page-popup__title">Копирование элемента</h2>
                <p class="page-popup__descr" data-info>
                <div class="form__block field-block">
                    <div class="field-block__header">
                        <b class="field-block__title">Выберите продукт из списка</b>
                    </div>
                    <div class="select select_input" data-copy-select>
                        <div class="select__header">
                            <div class="entry-input">
                                <input type="text" class="entry-input__field select__field select__title" placeholder="Введите что-нибудь">
                            </div>
                        </div>
                        <ul class="select__body">
                        </ul>
                    </div>
                    <div class="field-block__undertext">Выберите существующее значение.</div>
                    <div class="field-block__undertext_error"></div>
                </div>
                </p>
                <div class="page-popup__row">
                    <button class="page-popup__button button button_mini button_danger" data-okey>
                        Скопировать
                    </button>
                    <button class="page-popup__button button button_mini button_accent" data-close>
                        Вернуться
                    </button>
                </div>
            </div>
        `
        this.$modal.innerHTML = this.template
        await this.registerSelect()
        this.show()
        document.body.addEventListener('click', this.handlerChecker)
    }

    async registerSelect() {
        this.select = new SelectInputComponent({
            title: 'Выбор продукции',
            key: 'productId',
            query: '[data-copy-select]',
            data: [],
        })
        this.select.onchange = async (value) => {
            this.findedProducts = await productsModel.search(value)
            this.select.data = this.findedProducts.list.map(p => {
                return { value: p.title, dataset: p._id }
            })
        }
        this.select.render()
    }

    async handlerChecker(e) {
        if (e.target.dataset.close !== undefined) {
            this.remove()
        }
        if (e.target.closest('[data-okey]')) {
            const result = this.check()
            if (result) {
                this.remove()
            }
        }
    }

    check() {
        if (!this.select.getValue()) {
            this.select.showError('Поле должно быть заполнено!')
            return false
        }
        const product = this.findedProducts.list.find(item => item._id === this.select.getValue())
        this.onSelect(product)
        return true
    }


    destroy() {
        this.$modal.classList.remove('page-popup_wide')
        super.destroy()
    }
}
