import { html } from 'code-tag'

export default class ModalComponent {
    constructor({ selector, overlay, title, text, template, closeHandler, okayHandler }) {
        this.$modal = document.querySelector(selector || '.page-popup')
        this.$overlay = document.querySelector(overlay || '.page-overlay')
        this.template = template
        this.$overlay.setAttribute('data-close', '')
        this.bindedClose = this.destroy.bind(this)
        this.handlerChecker = this.handlerChecker.bind(this)
        this.closeHandler = closeHandler
        this.okayHandler = okayHandler
        this.title = title
        this.text = text
    }

    create() {
        if (this.template === 'default') {
            this.template = html`
                <button class="page-popup__close" data-close></button>
                <div class="page-popup__container">
                    <h2 class="page-popup__title">${this.title || ''}</h2>
                    <p class="page-popup__descr" data-info>${this.text || ''}</p>
                    <button class="page-popup__button button button_accent page-popup__button-close" data-close>
                        Закрыть
                    </button>
                </div>
            `
        } else if (this.template === 'choise') {
            this.template = html`
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
            if (this.okayHandler) {
                const result = await this.okayHandler()
                if(result) {
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
