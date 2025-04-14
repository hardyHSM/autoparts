import { html } from 'code-tag'

export default class ModalComponent {
    constructor({ selector, overlay, title, text, template, closeHandler, submitHandler, closeOnSubmit }) {
        this.$modal = document.querySelector(selector || '.page-popup')
        this.$overlay = document.querySelector(overlay || '.page-overlay')
        this.template = template
        this.$overlay.setAttribute('data-close', '')
        this.bindedClose = this.destroy.bind(this)
        this.handlerChecker = this.handlerChecker.bind(this)
        this.closeHandler = closeHandler
        this.submitHandler = submitHandler
        this.title = title
        this.text = text
        this.closeOnSubmit = closeOnSubmit || true
    }

    create() {
        if (this.template === 'default') {
            this.template = `
                <button class="page-popup__close" data-close></button>
                <div class="page-popup__container">
                    <h2 class="page-popup__title">${this.title || ''}</h2>
                    <p class="page-popup__descr" data-info>${this.text || ''}</p>
                    <button class="page-popup__button button button_accent page-popup__button-close" data-close>
                        Закрыть
                    </button>
                </div>
            `
        } else if (this.template === 'choose') {
            this.template = `
                <button class="page-popup__close" data-close></button>
                <div class="page-popup__container">
                    <h2 class="page-popup__title">${this.title || ''}</h2>
                    <p class="page-popup__descr" data-info>${this.text || ''}</p>
                    <div class="page-popup__row">
                        <button class="page-popup__button button button_danger" data-okey>
                            Да
                        </button>
                        <button class="page-popup__button button button_accent" data-close>
                            Нет
                        </button>
                    </div>
                </div>
            `
        }
        this.$modal.innerHTML = this.template
        this.show()
        document.body.addEventListener('click', this.handlerChecker)
    }

    async handlerChecker(e) {
        if (e.target.dataset.close !== undefined) {
            this.remove()
        }
        if (e.target.closest('[data-okey]')) {
            if (this.submitHandler) {
                const result = await this.submitHandler(this.$modal.querySelector('[data-okey]'))
                if(result && this.closeOnSubmit) {
                    this.remove()
                }
            }
        }
    }

    show() {
        this.$modal.classList.add('page-popup_active')
        this.$overlay.classList.add('page-overlay_active')
    }

    remove() {
        this.$modal.classList.remove('page-popup_active')
        this.$overlay.classList.remove('page-overlay_active')

        this.$modal.addEventListener('transitionend', this.bindedClose)
    }

    destroy() {
        this.$modal.removeEventListener('transitionend', this.bindedClose)
        document.body.removeEventListener('click', this.handlerChecker)
        this.$modal.innerHTML = ''
        if (this.closeHandler) this.closeHandler()
    }
}
